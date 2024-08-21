import { Cacheable } from '@knaus94/nestjs-cacheable';
import { Nullable, tPromise } from '@libs/core/common';
import { OKDto } from '@libs/core/server';
import { CustomInjectorService } from '@libs/custom-injector/server';
import { ProxyHelpersService } from '@libs/proxy/server/lib/proxy-services/proxy-helpers.service';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import SteamStore from '@libs/steam-store-web-api/steam-store-web-api';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { BotErrCodeEnum, BotStatusEnum } from '@prisma/client';
import Request from 'request';
import { getAuthCode } from 'steam-totp';
import SteamUser, { ECurrencyCode, EFriendRelationship, EMachineIDType, EResult } from 'steam-user';
import SteamCommunity from 'steamcommunity';
import CEconItem from 'steamcommunity/classes/CEconItem';
import SteamID from 'steamid';
import { BOT_CONFIG, BotConfig } from '../bot-configs/bot.config';
import { BotInterface } from '../bot-interfaces/bot.interface';
import { BotLoginSelectedFields, BotLoginType } from '../bot-types/bot-login.types';
import { BotEventsService } from './bot-events.service';
import { BotHelpersService } from './bot-helpers.service';
import { buildProxy } from '@libs/proxy/common/lib/proxy-utils/build-proxy.utils';

@Injectable()
export class BotService {
	private readonly logger = new Logger(BotService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly botHelpersService: BotHelpersService,
		private readonly botEventsService: BotEventsService,
		private readonly customInjectorService: CustomInjectorService,
		private readonly proxyHelpersService: ProxyHelpersService,
	) {}

	private readonly bots: Record<number, BotInterface> = {};

	get config() {
		return this.customInjectorService.getLastComponentByName<BotConfig>(BOT_CONFIG)!;
	}

	getBotInService(botId: number): BotInterface | undefined {
		return this.bots[botId];
	}

	async addBotToService(botId: number, bot: BotInterface) {
		await this.shutdownBot({ botId });

		this.bots[botId] = bot;
		this.updateBotSessionDate(botId);

		return this.bots[botId];
	}

	async shutdownBot(data: { botId: number; setStatus?: boolean; status?: BotStatusEnum; errCode?: BotErrCodeEnum; errMsg?: string }) {
		if (this.bots[data.botId]) {
			this.bots[data.botId].client.removeAllListeners();
			this.bots[data.botId].community.removeAllListeners();
			this.bots[data.botId].client.logOff();

			delete this.bots[data.botId];

			if (data.setStatus || data.status) {
				await this.botHelpersService.setStatus(data.botId, data.status ?? BotStatusEnum.STOPPED, data.errCode, data.errMsg);
			}
		}
	}

	getBotIdsInService() {
		return Object.getOwnPropertyNames(this.bots) as unknown as number[];
	}

	// async getRandomWebApiKey() {
	//     return tPromise<string>(
	//         new Promise((resolve, reject) => {
	//             return this.bots[Object.keys(this.bots)[Math.floor(Math.random() * Object.keys(this.bots).length)]].community.getWebApiKey(
	//                 this.config.projectUrl,
	//                 (err: Nullable<Error>, key: string) => {
	//                     if (err) {
	//                         reject();
	//                     }

	//                     resolve(key);
	//                 },
	//             );
	//         }),
	//         15 * 1000,
	//     );
	// }

	async getBotAndLogIn(botId: number, status?: BotStatusEnum, errCode?: BotErrCodeEnum) {
		return this.sdkPrismaService.bot
			.findUniqueOrThrow({
				where: {
					id: botId,
					status,
					errCode,
				},
				select: {
					...BotLoginSelectedFields,
				},
			})
			.then((bot) => this.logIn(bot))
			.catch(() => this.logger.error(`🤖 Bot ID: ${botId} | Getting failed`));
	}

	async logIn(account: BotLoginType) {
		//Собераем прокси и меняем статус бота
		let httpProxy = await this.proxyHelpersService.randomHttpProxy();
		if (account.proxy && account.proxy.isValid) {
			httpProxy = {
				...account.proxy,
				url: buildProxy(account.proxy),
			};
		}
		// if (!httpProxy) {
		// 	await this.botHelpersService.setStatus(account.id, BotStatusEnum.ERROR, null, 'Failed to find available proxies');

		// 	return false;
		// }

		await this.botHelpersService.setStatus(account.id, BotStatusEnum.STARTING, null, null, httpProxy?.id);

		const bot: BotInterface = {
			client: new SteamUser({
				httpProxy: httpProxy?.url,
				machineIdType: EMachineIDType.AccountNameGenerated,
			}),
			community: new SteamCommunity({
				//@ts-ignore
				request: Request.defaults({
					forever: true,
					proxy: httpProxy?.url,
				}),
				timeout: 30 * 1000,
			}),
			store: new SteamStore({
				httpProxy: httpProxy?.url,
				timeout: 30 * 1000,
			}),
			account,
		};

		//TODO: возможно стоит покрыть тру-кечами фул функцию из-за краша таймаута

		//Создаем таймаут промис, если в течении 15 сек мы не словим ошибку либо успех, прилетает ошибка
		return tPromise<void>(
			new Promise((resolve, reject) => {
				this.setListeners(bot, ['friendRelationship', 'wallet', 'loggedOn']);

				bot.client.on('error', (e) => {
					reject(e);
				});

				bot.client.on('webSession', async (_session, cookies) => {
					bot.client.removeAllListeners();
					this.logger.debug(`🤖 Bot ID: ${account.id} | Cleaned listeners`);

					bot.community.setCookies(cookies);
					bot.store.setCookies(cookies);

					this.setListeners(await this.addBotToService(account.id, bot), [
						'error',
						'friendRelationship',
						'loggedOn',
						'sessionExpired',
						'wallet',
						'webSession',
						'accountLimitations',
					]);

					resolve();
				});

				bot.client.logOn({
					accountName: account.login,
					password: account.password,
					twoFactorCode: getAuthCode(account.sharedSecret),
				});
			}),
			30 * 1000,
		)
			.then(() => this.botHelpersService.setStatus(account.id, BotStatusEnum.RUNNING))
			.then(() => this.logger.debug(`🤖 Bot ID: ${account.id} | Running`))
			.then(() => true)
			.catch(async (e) => {
				bot.client.removeAllListeners();
				bot.client.logOff();

				this.logger.warn(
					`🤖 Bot ID: ${account.id} | Proxy ID: ${account.proxy?.id ?? null}  | Authentication failed (${e?.message ?? null})`,
				);

				await Promise.all([
					this.shutdownBot({
						botId: account.id,
						setStatus: false,
					}),
					this.botHelpersService.setStatus(account.id, BotStatusEnum.ERROR, BotErrCodeEnum.AUTHENTICATION_FAILED, e?.message),
				]);

				if (e.message === 'Proxy connection timed out') {
					setTimeout(() => this.getBotAndLogIn(account.id, BotStatusEnum.ERROR, BotErrCodeEnum.AUTHENTICATION_FAILED), 60 * 1000);
				}

				return false;
			});
	}

	@Cacheable({
		namespace: BotService.name,
		ttl: 10 * 60 * 1000,
	}) //Обернул в кеш, дабы от куда-то не прилетел апдейт в тоже время
	async updateBotInventory(botId: number) {
		const bot = this.bots[botId];

		if (!bot) {
			this.logger.error(`🤖 Bot ID: ${botId} | Inventory updated error | Bot not found in Service`);

			return false;
		}

		return this.getBotInventory(bot)
			.then((inventory) => {
				this.botEventsService.sendToBotInventoryStream({
					bot: bot.account,
					newInventory: inventory,
				});

				this.logger.log(`🤖 Bot ID: ${botId} | Inventory updated`);
				return true;
			})
			.catch(async (e) => {
				this.logger.error(`🤖 Bot ID: ${botId} | Inventory updated error | ${e?.message}`);
				// if (e?.message === 'HTTP error 403') {
				// 	await this.shutdownBot({
				// 		botId: botId,
				// 		status: BotStatusEnum.ERROR,
				// 		errCode: BotErrCodeEnum.DISCONNECTED,
				// 		errMsg: `Steam API returned a 403 error. Check if the Steam API can be used by the account`,
				// 	});
				// }
				this.botEventsService.sendToBotInventoryStream({
					bot: bot.account,
					newInventory: [],
				});
				return false;
			});
	}

	async reloadBotSession(botId: number, validateSessionDate = false) {
		const bot = this.bots[botId];

		if (bot) {
			if (bot.client.steamID === null) {
				bot.client.logOn({
					accountName: bot.account.login,
					password: bot.account.password,
					twoFactorCode: getAuthCode(bot.account.sharedSecret),
				});
			} else {
				//Валидация даты создания сессии
				//Если сессия меньше 60 минут, пропускаем
				if (validateSessionDate && bot.session && new Date().getTime() - bot.session.createdAt.getTime() <= 60 * 60 * 1000) {
					return;
				}

				bot.client.webLogOn();
			}

			this.updateBotSessionDate(botId);

			this.logger.debug(`🤖 Bot ID: ${botId} | Session updated`);
		}
	}

	async addFriend(botId: number, steamId64: string) {
		this.logger.debug(`🤖 Bot ID: ${botId} | addFriend: ${steamId64}`);

		const bot = this.bots[botId];

		if (!bot) {
			throw new Error('Bot not found');
		}

		return tPromise<void>(
			new Promise((resolve, reject) => {
				bot.client.addFriend(steamId64, (err) => {
					if (err) {
						reject(err);
					}

					resolve();
				});
			}),
			15 * 1000,
		).catch((e) => {
			throw e;
		});
	}

	async removeFriend(botId: number, steamId64: string) {
		this.logger.debug(`🤖 Bot ID: ${botId} | removeFriend: ${steamId64}`);
		const bot = this.bots[botId];

		if (!bot) {
			return false;
		}

		return tPromise<boolean>(
			new Promise((resolve, _reject) => {
				bot.community.removeFriend(steamId64, (err: Nullable<Error>) => {
					if (err) {
						resolve(false);
					}

					resolve(true);
				});
			}),
			15 * 1000,
		).catch(() => {
			return false;
		});
	}

	async getFriendList(botId: number) {
		const bot = this.bots[botId];

		if (!bot) {
			throw new Error();
		}

		return tPromise<Record<string, EFriendRelationship>>(
			new Promise((resolve, reject) => {
				bot.community.getFriendsList((err: Nullable<Error>, users: Record<string, EFriendRelationship>) => {
					if (err) {
						reject(err);
					}

					resolve(users);
				});
			}),
			15 * 1000,
		);
	}

	private async getBotInventory({ community }: Pick<BotInterface, 'community'>) {
		return tPromise<CEconItem[]>(
			new Promise((resolve, reject) => {
				community.getUserInventoryContents(
					community.steamID.getSteamID64(),
					753,
					1,
					false,
					'en', // @ts-ignore
					(err: Nullable<Error>, inventory: CEconItem[], _currency: CEconItem[], _totalItems: number) => {
						if (err) {
							this.logger.error(err);

							reject(err);
						}

						resolve(inventory);
					},
				);
			}),
			15 * 1000,
		);
	}

	private setListeners(
		{ client, community, store, account }: BotInterface,
		events: ('loggedOn' | 'webSession' | 'sessionExpired' | 'wallet' | 'friendRelationship' | 'error' | 'accountLimitations')[],
	) {
		if (events.indexOf('loggedOn') !== -1)
			client.on('loggedOn', () => {
				client.setPersona(SteamUser.EPersonaState.Online);

				this.logger.debug(`🤖 Bot ID: ${account.id} | Proxy ID: ${account.proxy?.id ?? null} | Logged in`);
			});

		if (events.indexOf('sessionExpired') !== -1) community.on('sessionExpired', () => this.reloadBotSession(account.id));

		if (events.indexOf('wallet') !== -1)
			client.on('wallet', (_hasWallet, currency: ECurrencyCode, newBalance: number) =>
				this.botHelpersService.handleUpdateWalletBalance(account.id, currency, newBalance),
			);

		if (events.indexOf('friendRelationship') !== -1)
			client.on('friendRelationship', (sid: SteamID, relationship: EFriendRelationship) =>
				this.botEventsService.sendToBotFriendRelationshipStream({
					bot: account,
					relationship: relationship,
					steamId64: sid.getSteamID64(),
				}),
			);

		if (events.indexOf('error') !== -1)
			client.on('error', async (e) => {
				this.logger.error(`🤖 Bot ID: ${account.id} | Proxy ID: ${account.proxy?.id ?? null} | ${e.message}`);

				if ([EResult.InvalidPassword, EResult.ConnectFailed, EResult.NoConnection, EResult.RemoteDisconnect].includes(e.eresult)) {
					await this.shutdownBot({
						botId: account.id,
						status: BotStatusEnum.ERROR,
						errCode: BotErrCodeEnum.DISCONNECTED,
						errMsg: e.message,
					});

					if (e.message === 'Proxy connection timed out') {
						setTimeout(() => this.getBotAndLogIn(account.id, BotStatusEnum.ERROR, BotErrCodeEnum.DISCONNECTED), 60 * 1000);
					}
				}
			});

		if (events.indexOf('accountLimitations') !== -1)
			client.on('accountLimitations', async (isTrue) => {
				if (isTrue) {
					await this.shutdownBot({
						botId: account.id,
						status: BotStatusEnum.ERROR,
						errCode: BotErrCodeEnum.ACCOUNT_LIMITATIONS,
					});
				}
			});

		if (events.indexOf('webSession') !== -1)
			client.on('webSession', async (_session, cookies) => {
				community.setCookies(cookies);
				store.setCookies(cookies);
			});

		this.logger.debug(`🤖 Bot ID: ${account.id} | Set listeners: ${events.join(', ')}`);
	}

	private updateBotSessionDate(botId: number) {
		if (this.bots[botId]) {
			this.bots[botId].session = {
				createdAt: new Date(),
			};
		}
	}

	@Interval('reloadSessions', 1 * 60 * 1000) //Каждую минуту
	private async handleInterval() {
		for (const botId of this.getBotIdsInService()) {
			await this.reloadBotSession(botId, true);
		}
	}
}
