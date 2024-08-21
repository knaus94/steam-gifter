import { BotService } from '@libs/bot/server';
import { Nullable, throwError, tuple } from '@libs/core/common';
import { ClsCustomStore, OKDto } from '@libs/core/server';
import { DigisellerConfigService, DigisellerService } from '@libs/digiseller/server';
import { ProxyHelpersService } from '@libs/proxy/server/lib/proxy-services/proxy-helpers.service';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { TransactionErrorsEnum } from '@libs/transaction/common';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, TransactionEventEnum, TransactionStatusEnum } from '@prisma/client';
import { randomBytes } from 'crypto';
import { ClsService } from 'nestjs-cls';
import { PrismaError } from 'prisma-error-enum';
import { EFriendRelationship, EResult } from 'steamcommunity';
import { setTimeout as delay } from 'timers/promises';
import { REGEX_PROFILE_LINK } from '../transaction-constants/transaction.constants';
import { TransactionError } from '../transaction-errors/transaction-error';
import { TransactionSelectedFields } from '../transaction-types/transaction.types';
import { TransactionHelpersService } from './transaction-helpers.service';

@Injectable()
export class TransactionService {
	private readonly logger = new Logger(TransactionService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly botService: BotService,
		private readonly digisellerConfigService: DigisellerConfigService,
		private readonly digisellerService: DigisellerService,
		private readonly transactionHelpersService: TransactionHelpersService,
		private readonly requestContext: ClsService<ClsCustomStore>,
		private readonly proxyHelpersService: ProxyHelpersService,
	) {}

	async getTransaction(uniqCode: string) {
		const hasTransaction = await this.sdkPrismaService.transaction.findFirst({
			where: {
				paymentDetails: {
					uniqCode,
				},
			},
			select: {
				...TransactionSelectedFields,
			},
		});
		if (hasTransaction) {
			return hasTransaction;
		}

		const digiseller = await this.digisellerService
			.findUniqCode(uniqCode)
			.catch(() => throwError(() => new TransactionError(TransactionErrorsEnum.TransactionGettingError, this.requestContext.get().i18n)));
		if (!digiseller) {
			throw new TransactionError(TransactionErrorsEnum.TransactionNotFound, this.requestContext.get().i18n);
		}

		// Парсим дату в объект Date
		const matchArray: RegExpMatchArray | null = digiseller.date_pay.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);

		if (matchArray) {
			const [, day, month, year, hour, minute, second] = matchArray;
			const enteredDate: Date = new Date(
				parseInt(year, 10),
				parseInt(month, 10) - 1,
				parseInt(day, 10),
				parseInt(hour, 10),
				parseInt(minute, 10),
				parseInt(second, 10),
			);

			if (!isNaN(enteredDate.getTime())) {
				const timeDifference: number = Date.now() - enteredDate.getTime();

				if (timeDifference > 3 * 24 * 60 * 60 * 1000) {
					throw new TransactionError(TransactionErrorsEnum.TransactionNotFound, this.requestContext.get().i18n);
				}
			}
		}

		const digisellerConfig = await this.digisellerConfigService.getConfig();

		const regionFieldValue = digiseller.options?.find((option) => Object.values(digisellerConfig.regionFieldName).includes(option.name))
			?.value;
		if (!regionFieldValue) {
			throw new TransactionError(TransactionErrorsEnum.RegionFieldNotFound, this.requestContext.get().i18n);
		}

		// const selectedRegion = digisellerConfig.regions.find(({ name }) => name.toLowerCase().trim() === regionFieldValue.toLowerCase().trim());
		// if (!selectedRegion) {
		// 	throw new TransactionError(TransactionErrorsEnum.RegionInvalid, this.requestContext.get().i18n);
		// }

		const selectedRegion = digisellerConfig.regions
			.flatMap((region) => {
				const [name1, name2] = region.name.split('|');
				return [
					{ ...region, name: name1 },
					{ ...region, name: name2 ?? name1 },
				];
			})
			.find(({ name }) => name.toLowerCase().trim() === regionFieldValue.toLowerCase().trim());
		if (!selectedRegion) {
			throw new TransactionError(TransactionErrorsEnum.RegionInvalid, this.requestContext.get().i18n);
		}

		const profileLinkFieldValue = digiseller.options?.find((option) =>
			Object.values(digisellerConfig.profileLinkFieldName).includes(option.name),
		)?.value;
		if (!profileLinkFieldValue) {
			throw new TransactionError(TransactionErrorsEnum.SteamLinkFieldNotFound, this.requestContext.get().i18n);
		}

		await this.sdkPrismaService.transaction
			.findFirst({
				where: {
					profileLink: profileLinkFieldValue,
					status: {
						not: TransactionStatusEnum.SUCCESS,
					},
				},
			})
			.then(
				(hasTransaction) =>
					hasTransaction &&
					throwError(() => new TransactionError(TransactionErrorsEnum.AlreadyHaveTransaction, this.requestContext.get().i18n)),
			);

		const digisellerProduct = await this.sdkPrismaService.digisellerProduct
			.findFirstOrThrow({
				where: {
					digisellerId: digiseller.id_goods,
				},
				select: {
					id: true,
					name: true,
					editionSelection: true,
					editions: {
						where: {
							isDeleted: false,
						},
						select: {
							id: true,
							name: true,
							product: {
								select: {
									id: true,
									prices: true,
								},
							},
							bots: {
								select: {
									region: {
										select: {
											id: true,
										},
									},
									botRegions: true,
								},
							},
						},
					},
				},
			})
			.catch(() => throwError(() => new TransactionError(TransactionErrorsEnum.ProductNotFound, this.requestContext.get().i18n)));

		const selectedEdition = (() => {
			const editionNonRegion = digisellerProduct.editions.find(({ name }) => name === null);
			if (editionNonRegion) {
				return editionNonRegion;
			}

			if (!digisellerProduct.editionSelection) {
				throw new TransactionError(TransactionErrorsEnum.ProductNotFound, this.requestContext.get().i18n);
			}

			const editionFieldValue = digiseller.options?.find((option) =>
				Object.values(digisellerConfig.editionSelectionFieldName).includes(option.name),
			)?.value;
			if (!editionFieldValue) {
				throw new TransactionError(TransactionErrorsEnum.EditionFieldNotFound, this.requestContext.get().i18n);
			}

			const edition = digisellerProduct.editions.find(({ name }) => name?.trim() === editionFieldValue.trim());
			if (!edition) {
				throw new TransactionError(TransactionErrorsEnum.EditionInvalid, this.requestContext.get().i18n);
			}

			return edition;
		})();

		const editionConfig = selectedEdition.bots.find(({ region }) => region.id === selectedRegion.id);
		if (!editionConfig) {
			throw new TransactionError(TransactionErrorsEnum.RegionInvalid, this.requestContext.get().i18n);
		}

		await this.sdkPrismaService.transactionPaymentDetails
			.findFirst({
				where: {
					invoice: digiseller.inv,
				},
			})
			.then(
				(hasInvoice) =>
					hasInvoice &&
					throwError(() => new TransactionError(TransactionErrorsEnum.InvoiceDuplicated, this.requestContext.get().i18n)),
			);

		const bot = await this.transactionHelpersService.findBot(selectedEdition.product.prices, editionConfig.botRegions);
		if (!bot) {
			this.transactionHelpersService
				.sendNotification(
					digiseller.inv,
					uniqCode,
					TransactionErrorsEnum.BotNotFound,
					`${digisellerProduct.name}${selectedEdition.name ? ` ${selectedEdition.name}` : ''}`,
				)
				.then(() => {});
			throw new TransactionError(TransactionErrorsEnum.BotNotFound, this.requestContext.get().i18n);
		}

		const [transaction, error] = await tuple(
			this.sdkPrismaService.$transaction(async (prisma) => {
				const reservedSum = selectedEdition.product.prices[bot.region] ?? 99999999;

				const [createdTransaction, updatedBot] = await Promise.all([
					prisma.transaction.create({
						data: {
							paymentDetails: {
								create: {
									uniqCode,
									invoice: digiseller.inv,
								},
							},
							bot: {
								connect: {
									id: bot.id,
								},
							},
							edition: {
								connect: {
									id: selectedEdition.id,
								},
							},
							profileLink: profileLinkFieldValue,
							reservedSum,
							status: TransactionStatusEnum.CREATED,
							region: selectedRegion.name,
							logs: {
								create: {
									status: TransactionStatusEnum.CREATED,
								},
							},
						},
						select: {
							...TransactionSelectedFields,
						},
					}),
					prisma.bot.update({
						where: {
							id: bot.id,
						},
						data: {
							reservedBalance: {
								increment: reservedSum,
							},
						},
						select: {
							balance: true,
							reservedBalance: true,
						},
					}),
				]);

				if (updatedBot.balance - updatedBot.reservedBalance < 0) {
					throw new Error();
				}

				return createdTransaction;
			}),
		);

		if (error) {
			this.transactionHelpersService
				.sendNotification(
					digiseller.inv,
					uniqCode,
					TransactionErrorsEnum.BotNotFound,
					`${digisellerProduct.name}${selectedEdition.name ? ` ${selectedEdition.name}` : ''}`,
				)
				.then(() => {});
			throw new TransactionError(TransactionErrorsEnum.BotNotFound, this.requestContext.get().i18n);
		}

		this.initTransaction(transaction.id, transaction.profileLink, null, transaction.bot?.id ?? null, TransactionStatusEnum.CREATED).then(
			() => {},
		);

		return transaction;
	}

	async initTransaction(
		transactionId: number,
		profileLink: string,
		steamId64: Nullable<string>,
		botId: Nullable<number>,
		oldStatus?: TransactionStatusEnum,
	) {
		this.logger.debug(`initTransaction: ${transactionId}`);

		if (!botId) {
			return this.transactionHelpersService.updateStatus({
				transactionId,
				newStatus: TransactionStatusEnum.ERROR,
				currentStatus: oldStatus,
				event: TransactionEventEnum.BOT_NOT_FOUND,
				broadcast: true,
			});
		}

		const oldSteamId64 = steamId64;

		if (!steamId64) {
			if (!REGEX_PROFILE_LINK.test(profileLink)) {
				return this.transactionHelpersService.updateStatus({
					transactionId,
					newStatus: TransactionStatusEnum.ERROR,
					currentStatus: oldStatus,
					event: TransactionEventEnum.PROFILE_LINK_NOT_VALID,
					broadcast: true,
				});
			}

			const parseSteamId64 = await this.transactionHelpersService.parseSteamId64FromProfileLink(
				profileLink,
				await this.proxyHelpersService.randomHttpProxy().then((proxy) => proxy?.url),
			);
			if (!parseSteamId64) {
				return this.transactionHelpersService.updateStatus({
					transactionId,
					newStatus: TransactionStatusEnum.ERROR,
					currentStatus: oldStatus,
					event: TransactionEventEnum.FAILED_GET_STEAM_ID,
					broadcast: true,
				});
			}

			steamId64 = parseSteamId64;
		}

		await this.sdkPrismaService.transaction
			.update({
				where: {
					id: transactionId,
				},
				data: {
					steamId64: steamId64 !== oldSteamId64 ? steamId64 : undefined,
					sendAttempts: {
						decrement: 1,
					},
				},
			})
			.catch(() => {});

		const [friendList, friendListError] = await tuple(this.botService.getFriendList(botId));
		if (!friendListError && friendList[steamId64] == EFriendRelationship.Friend) {
			await this.botService.removeFriend(botId, steamId64);
		}

		const [, addFriendError] = await tuple(this.botService.addFriend(botId, steamId64));
		if (addFriendError && addFriendError?.eresult != EResult.DuplicateName) {
			return this.transactionHelpersService.updateStatus({
				transactionId,
				newStatus: TransactionStatusEnum.ERROR,
				currentStatus: oldStatus,
				event: TransactionEventEnum.FRIEND_REQUEST_FAIL,
				broadcast: true,
				errMsg: addFriendError?.message,
			});
		}

		return this.transactionHelpersService.updateStatus({
			transactionId,
			newStatus: TransactionStatusEnum.FRIEND_REQUEST_SENT,
			currentStatus: oldStatus,
			broadcast: true,
		});
	}

	async processTransaction(transactionId: number) {
		this.logger.debug(`Started transaction: ${transactionId}`);

		const transaction = await this.sdkPrismaService.transaction.findFirst({
			where: {
				id: transactionId,
			},
			select: {
				id: true,
				status: true,
				steamId64: true,
				edition: {
					select: {
						product: {
							select: {
								isBundle: true,
								identifier: true,
							},
						},
					},
				},
				bot: {
					select: {
						id: true,
						region: true,
					},
				},
			},
		});
		if (!transaction || transaction.status !== TransactionStatusEnum.PROCESS) {
			return;
		}

		const oldStatus = transaction.status;

		if (!transaction.bot) {
			return this.transactionHelpersService.updateStatus({
				transactionId,
				newStatus: TransactionStatusEnum.ERROR,
				currentStatus: oldStatus,
				event: TransactionEventEnum.BOT_NOT_FOUND,
				broadcast: true,
			});
		}

		if (!transaction.steamId64) {
			return this.transactionHelpersService.updateStatus({
				transactionId,
				newStatus: TransactionStatusEnum.ERROR,
				currentStatus: oldStatus,
				event: TransactionEventEnum.FAILED_GET_STEAM_ID,
				broadcast: true,
			});
		}

		const bot = this.botService.getBotInService(transaction.bot.id);
		if (!bot) {
			return this.transactionHelpersService.updateStatus({
				transactionId,
				newStatus: TransactionStatusEnum.ERROR,
				currentStatus: oldStatus,
				event: TransactionEventEnum.BOT_IS_OFFLINE,
				broadcast: true,
			});
		}

		bot.store.forgetCart();

		try {
			await bot.store.addToCart(transaction.edition.product.isBundle, transaction.edition.product.identifier).then(() => delay(1000));
			this.logger.debug(`Transaction: ${transaction.id} | Added to cart`);

			//Получаем ID транзакции
			const steamTransactionId = await bot.store.initTransaction(
				transaction.bot.region,
				transaction.steamId64,
				transaction.id.toString(),
				randomBytes(12).toString('hex'),
				randomBytes(12).toString('hex'),
			);
			this.logger.debug(`Transaction: ${transaction.id} | initTransaction: ${steamTransactionId}`);
			await delay(1000);

			await bot.store.getFinalPrice(steamTransactionId).then(() => delay(1000));

			await bot.store.finalizeTransaction(steamTransactionId).then(() => delay(2000));
			this.logger.debug(`Transaction: ${transaction.id} | finalizeTransaction`);

			const assetId = await bot.store.getTransactionAssetID(steamTransactionId);
			this.logger.debug(`Transaction: ${transaction.id} | getTransactionAssetID: ${assetId}`);
			await delay(100);

			return Promise.all([
				this.botService.removeFriend(transaction.bot.id, transaction.steamId64),
				this.transactionHelpersService.updateStatus({
					transactionId: transaction.id,
					newStatus: assetId ? TransactionStatusEnum.SENT_GIFT : TransactionStatusEnum.SUCCESS,
					event: !assetId ? TransactionEventEnum.PURCHASE_INFO_NOT_AVAILABLE : undefined,
					broadcast: true,
					purchaseInfo: {
						assetId: assetId ?? undefined,
						transactionId: steamTransactionId,
					},
				}),
			]).then(() => true);
		} catch (e) {
			this.logger.error(e);

			return Promise.all([
				this.botService.removeFriend(transaction.bot.id, transaction.steamId64),
				this.transactionHelpersService.updateStatus({
					transactionId,
					newStatus: TransactionStatusEnum.ERROR,
					currentStatus: oldStatus,
					event: TransactionEventEnum.FAIL,
					broadcast: true,
					errMsg: `${e?.code ?? 'Unknown code'}${e?.message ? ` | ${e.message}` : ''}`,
				}),
			]).then(() => false);
		}
	}

	async updateTransactionProfileLink(uniqCode: string, profileLink: string) {
		const transaction = await this.sdkPrismaService.transaction
			.findFirstOrThrow({
				where: {
					paymentDetails: {
						uniqCode,
					},
				},
				select: {
					id: true,
				},
			})
			.catch(() => {
				throw new TransactionError(TransactionErrorsEnum.TransactionNotFound, this.requestContext.get().i18n);
			});

		return this.sdkPrismaService.transaction
			.update({
				where: {
					id: transaction.id,
				},
				data: {
					profileLink,
					steamId64: null,
				},
			})
			.then(() => new OKDto())
			.catch((e) => {
				if (e instanceof Prisma.PrismaClientKnownRequestError) {
					if (e.code === PrismaError.RecordsNotFound) {
						throw new TransactionError(TransactionErrorsEnum.TransactionNotFound, this.requestContext.get().i18n);
					}
				}

				throw new TransactionError(TransactionErrorsEnum.UnknownError, this.requestContext.get().i18n);
			});
	}

	async resendTransaction(uniqCode: string) {
		const transaction = await this.sdkPrismaService.transaction
			.findFirstOrThrow({
				where: {
					paymentDetails: {
						uniqCode,
					},
					status: TransactionStatusEnum.ERROR,
				},
				select: {
					id: true,
					profileLink: true,
					steamId64: true,
					botId: true,
					sendAttempts: true,
					logs: {
						orderBy: {
							id: 'desc',
						},
						take: 1,
					},
				},
			})
			.catch(() => {
				throw new TransactionError(TransactionErrorsEnum.TransactionNotFound, this.requestContext.get().i18n);
			});

		if (transaction.sendAttempts <= 0) {
			throw new TransactionError(TransactionErrorsEnum.TransactionResendLimit, this.requestContext.get().i18n);
		}

		if (!REGEX_PROFILE_LINK.test(transaction.profileLink)) {
			throw new TransactionError(TransactionErrorsEnum.SteamLinkNotValid, this.requestContext.get().i18n);
		}

		const lastLog = transaction.logs[0];
		if (lastLog && lastLog.status === TransactionStatusEnum.ERROR) {
			switch (lastLog.event) {
				case TransactionEventEnum.FRIEND_TIMEOUT:
					const lastHourDate = new Date(Date.now() - 1 * 60 * 60 * 1000);

					if (lastLog.createdAt > lastHourDate) {
						const nearestExpiryTime = (lastLog.createdAt.getTime() - lastHourDate.getTime()) / 1000;

						throw new TransactionError(TransactionErrorsEnum.FriendRequestCooldown, this.requestContext.get().i18n, {
							args: { nearestExpiryTime },
						});
					}
					break;

				case TransactionEventEnum.FAIL:
					const lastFiveMinutesDate = new Date(Date.now() - 5 * 60 * 1000);

					if (lastLog.createdAt > lastFiveMinutesDate) {
						const nearestExpiryTime = (lastLog.createdAt.getTime() - lastFiveMinutesDate.getTime()) / 1000;

						throw new TransactionError(TransactionErrorsEnum.FriendRequestCooldown, this.requestContext.get().i18n, {
							args: { nearestExpiryTime },
						});
					}
					break;
			}
		}

		const isUpdated = await this.transactionHelpersService.updateStatus({
			transactionId: transaction.id,
			currentStatus: TransactionStatusEnum.ERROR,
			newStatus: TransactionStatusEnum.CREATED,
			event: TransactionEventEnum.RESEND,
			broadcast: true,
		});
		if (!isUpdated) {
			throw new TransactionError(TransactionErrorsEnum.UnknownError, this.requestContext.get().i18n);
		}

		this.initTransaction(
			transaction.id,
			transaction.profileLink,
			transaction.steamId64,
			transaction.botId,
			TransactionStatusEnum.CREATED,
		).then(() => this.logger.log(`initTransaction: ${transaction.id}`));

		return new OKDto();
	}
}
