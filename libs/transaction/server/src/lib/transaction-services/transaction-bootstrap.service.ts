import { BotEventsService, BotService } from '@libs/bot/server';
import { tuple } from '@libs/core/common';
import { CustomInjectorService } from '@libs/custom-injector/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { TransactionStatusEnum as SteamTransactionStatusEnum } from '@libs/steam-store-web-api/steam-store-web-api-types/steam-store-web-api.types';
import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { BotStatusEnum, TransactionEventEnum, TransactionStatusEnum } from '@prisma/client';
import Redis from 'ioredis';
import { filter } from 'rxjs';
import { EFriendRelationship } from 'steamcommunity';
import { TRANSACTION_REDIS_CONNECTION } from '../transaction-constants/transaction.constants';
import { TransactionEventsService } from './transaction-events.service';
import { TransactionHelpersService } from './transaction-helpers.service';
import { TransactionQueueService } from './transaction-queue.service';

@Injectable()
export class TransactionBootstrapService implements OnModuleInit, OnApplicationBootstrap {
	private readonly logger = new Logger(TransactionBootstrapService.name);

	constructor(
		private readonly customInjectorService: CustomInjectorService,
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly botService: BotService,
		private readonly transactionEventsService: TransactionEventsService,
		private readonly botEventsService: BotEventsService,
		private readonly transactionHelpersService: TransactionHelpersService,
		private readonly transactionQueueService: TransactionQueueService,
	) {}

	private get redisConnection() {
		return this.customInjectorService.getLastComponentByName<Redis>(TRANSACTION_REDIS_CONNECTION)!;
	}

	async onModuleInit() {
		this.logger.debug('onModuleInit');

		//Чистим очереди
		try {
			await this.redisConnection.del(await this.redisConnection.keys('bull:*'));
		} catch (e) {
		} finally {
			this.logger.debug('Bull cleaned!');
		}
	}

	onApplicationBootstrap() {
		this.logger.log('onApplicationBootstrap');

		setTimeout(
			() =>
				this.transactionFriendValidate()
					.then(() => this.logger.debug('Transactions friend checker completed!'))
					.catch((e) => this.logger.error(e)),
			3 * 60 * 1000,
		);

		this.subscribeToListenBotInventoryStream();
		this.subscribeToListenTransactionStatusStream();
	}

	//TODO: надо бы провалидировать транзакции у которых бот или стим ид не указаны
	async transactionFriendValidate() {
		const transactions = await this.sdkPrismaService.transaction
			.findMany({
				where: {
					status: TransactionStatusEnum.FRIEND_REQUEST_SENT,
					botId: {
						not: null,
					},
					steamId64: {
						not: null,
					},
				},
				select: {
					id: true,
					botId: true,
					steamId64: true,
				},
			})
			.then((data) =>
				data.reduce((acc: Record<number, { transactionId: number; steamId64: string }[]>, { botId, id: transactionId, steamId64 }) => {
					acc[botId!] ??= [];
					acc[botId!].push({ transactionId, steamId64: steamId64! });
					return acc;
				}, {}),
			);

		if (Object.keys(transactions).length === 0) {
			return;
		}

		for (const data in transactions) {
			const botId = Number(data);
			const transactionIds = transactions[botId];

			const [friendList, friendListError] = await tuple(this.botService.getFriendList(botId));
			if (friendListError) {
				for (const { transactionId } of transactionIds) {
					await this.transactionHelpersService.updateStatus({
						transactionId,
						newStatus: TransactionStatusEnum.ERROR,
						currentStatus: TransactionStatusEnum.FRIEND_REQUEST_SENT,
						event: TransactionEventEnum.BOT_IS_OFFLINE,
						broadcast: true,
					});
				}

				continue;
			}

			for (const { transactionId, steamId64 } of transactionIds) {
				const status = friendList[steamId64];
				if (status !== undefined && status === EFriendRelationship.Friend) {
					await this.transactionHelpersService
						.updateStatus({
							transactionId,
							currentStatus: TransactionStatusEnum.FRIEND_REQUEST_SENT,
							newStatus: TransactionStatusEnum.PROCESS,
							broadcast: true,
						})
						.then(() => this.transactionQueueService.addTransactionToQueue(botId, transactionId))
						.catch((e) => this.logger.error(e));
				}
			}
		}
	}

	/**
	 * Обновление инвентарей ботов каждые 5 минуты, у которых висят транзакции со статусом `SENT_GIFT`
	 */
	@Interval('updateTransactionBotInventory', 5 * 60 * 1000)
	private async handleIntervalUpdateTransactionBotInventory() {
		return this.sdkPrismaService.transaction
			.findMany({
				where: {
					status: TransactionStatusEnum.SENT_GIFT,
					bot: {
						status: BotStatusEnum.RUNNING,
					},
				},
				distinct: ['botId'],
				select: {
					bot: {
						select: {
							id: true,
							proxyId: true,
						},
					},
				},
			})
			.then(async (transactions) => {
				if (!transactions.length) {
					return;
				}

				//Собираем список из уникальный проксей
				const proxyIds = [...new Set(transactions.map(({ bot }) => bot!.proxyId))];

				//Запускаем параллельно-последовательные функции
				for (const key of proxyIds) {
					const transactionsFiltered = transactions.filter(({ bot }) => bot!.proxyId === key);

					if (transactionsFiltered.length) {
						setTimeout(async () => {
							for (const { bot } of transactionsFiltered) {
								await this.botService.updateBotInventory(bot!.id);
							}
						}, 0);
					}
				}
			})
			.catch((e) => {
				this.logger.error(e);
			});
	}

	/**
	 * Получаем транзакции у которых запрос в друзья был отправлен более 5 минут назад.
	 * Если статус не изменился в течении 5 минут - удаляем из друзей
	 */
	@Interval('friendCheckStatus', 10 * 60 * 1000)
	private async handleIntervalFriendCheckStatus() {
		return this.sdkPrismaService.transaction
			.findMany({
				where: {
					status: TransactionStatusEnum.FRIEND_REQUEST_SENT,
					bot: {
						status: BotStatusEnum.RUNNING,
					},
					updatedAt: { lte: new Date(Date.now() - 5 * 60 * 1000) }, //апдейт более 5 минут назад
				},
				select: {
					id: true,
					steamId64: true,
					bot: {
						select: {
							id: true,
							proxyId: true,
						},
					},
				},
			})
			.then(async (transactions) => {
				if (!transactions.length) {
					return;
				}

				//Собираем список из уникальный проксей
				const proxyIds = [...new Set(transactions.map(({ bot }) => bot!.proxyId))];

				//Запускаем параллельно-последовательные функции
				for (const key of proxyIds) {
					const transactionsFiltered = transactions.filter(({ bot }) => bot!.proxyId === key);

					if (transactionsFiltered.length) {
						setTimeout(async () => {
							for (const { bot, steamId64 } of transactionsFiltered) {
								await this.botService.removeFriend(bot!.id, steamId64!);
							}
						}, 0);
					}
				}

				for (const { id } of transactions) {
					await this.transactionHelpersService.updateStatus({
						transactionId: id,
						newStatus: TransactionStatusEnum.ERROR,
						currentStatus: TransactionStatusEnum.FRIEND_REQUEST_SENT,
						event: TransactionEventEnum.FRIEND_TIMEOUT,
						broadcast: true,
					});
				}
			})
			.catch((e) => {
				this.logger.error(e);
			});
	}

	/**
	 * Подписываем на статус транзакций.
	 * При успешном завершении транзакции, убираем резервирование баланса
	 */
	private subscribeToListenTransactionStatusStream() {
		this.logger.debug('subscribeToListenTransactionStatusStream');
		this.transactionEventsService
			.listenTransactionStatusStream()
			.pipe(filter(({ status }) => status === TransactionStatusEnum.SUCCESS))
			.subscribe(async ({ transaction, status }) =>
				this.sdkPrismaService.transaction
					.findFirstOrThrow({
						where: {
							id: transaction.id,
							status,
							botId: {
								not: null,
							},
						},
						select: {
							reservedSum: true,
							botId: true,
						},
					})
					.then(({ botId, reservedSum }) =>
						this.sdkPrismaService.bot.update({
							where: {
								id: botId!,
							},
							data: {
								reservedBalance: {
									decrement: reservedSum,
								},
							},
						}),
					)
					.catch(() => {}),
			);
	}

	/**
	 * Подписка на обновление инвентаря.
	 * Получаем транзакции у которых был отправлен гифт менее минуты назад.
	 * Ищем в инвентаре отсутствующие AssetID, если такой имеется, пробиваем инфу по транзакции дальше, и уже закрываем её.
	 */
	private subscribeToListenBotInventoryStream() {
		this.logger.debug('subscribeToListenBotInventoryStream');
		this.botEventsService.listenBotInventoryStream().subscribe(async ({ bot: botInfo, newInventory }) => {
			const transactions = await this.sdkPrismaService.transaction.findMany({
				where: {
					botId: botInfo.id,
					status: TransactionStatusEnum.SENT_GIFT,
					updatedAt: { lte: new Date(Date.now() - 60 * 1000) }, //апдейт больше минуты назад, дабы не словить моменты когда транзакция не успеет попасть в инв
				},
				select: {
					id: true,
					purchaseInfo: true,
				},
			});

			if (!transactions.length) {
				return;
			}

			for (const { id, purchaseInfo } of transactions) {
				try {
					if (!purchaseInfo || !purchaseInfo.assetId || !purchaseInfo.transactionId) {
						await this.transactionHelpersService.updateStatus({
							transactionId: id,
							newStatus: TransactionStatusEnum.SUCCESS,
							currentStatus: TransactionStatusEnum.SENT_GIFT,
							event: TransactionEventEnum.PURCHASE_INFO_IS_NULL,
							broadcast: true,
						});

						continue;
					}

					if (newInventory.findIndex((item) => item.assetid === purchaseInfo.assetId) === -1) {
						//обрабатываем дальше транзакцию
						//надо получить инфу по ней и глянуть статус

						const bot = this.botService.getBotInService(botInfo.id);

						if (!bot) {
							//Если бота нету в сервисе так же закрываем транзакцию
							await this.transactionHelpersService.updateStatus({
								transactionId: id,
								newStatus: TransactionStatusEnum.SUCCESS,
								currentStatus: TransactionStatusEnum.SENT_GIFT,
								event: TransactionEventEnum.BOT_IS_OFFLINE,
								broadcast: true,
							});

							continue;
						}

						//TODO: добавить рекурсию на статус - TransactionStatusEnum.Invalid
						const transactionStatus = await bot.store.getTransactionStatus(purchaseInfo.transactionId);

						switch (transactionStatus) {
							case SteamTransactionStatusEnum.None:
								await this.transactionHelpersService.updateStatus({
									transactionId: id,
									newStatus: TransactionStatusEnum.SUCCESS,
									currentStatus: TransactionStatusEnum.SENT_GIFT,
									broadcast: true,
								});

								break;

							case SteamTransactionStatusEnum.Declined:
								await this.transactionHelpersService.updateStatus({
									transactionId: id,
									newStatus: TransactionStatusEnum.ERROR,
									currentStatus: TransactionStatusEnum.SENT_GIFT,
									event: TransactionEventEnum.GIFT_DECLINED,
									broadcast: true,
								});
								break;

							default:
								await this.transactionHelpersService.updateStatus({
									transactionId: id,
									newStatus: TransactionStatusEnum.SUCCESS,
									currentStatus: TransactionStatusEnum.SENT_GIFT,
									event: TransactionEventEnum.PURCHASE_INFO_NOT_AVAILABLE,
									broadcast: true,
								});
								break;
						}
					}
				} catch (e) {
					this.logger.error(e);
				}
			}
		});
	}
}
