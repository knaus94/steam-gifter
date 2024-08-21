import { Cacheable } from '@knaus94/nestjs-cacheable';
import { Nullable } from '@libs/core/common';
import { OKDto } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { TelegramService } from '@libs/telegram/server/lib/telegram-services/telegram.service';
import { TransactionErrorsEnum } from '@libs/transaction/common';
import { Injectable, Logger } from '@nestjs/common';
import { BotStatusEnum, Prisma, RegionCodeEnum, TransactionEventEnum, TransactionStatusEnum } from '@prisma/client';
import axios from 'axios';
import * as Cheerio from 'cheerio';
import { HttpsProxyAgent } from 'https-proxy-agent';
import SteamID from 'steamid';
import { TransactionStatusLogSelectedFields } from '../transaction-types/transaction-status-log.types';
import { TransactionEventsService } from './transaction-events.service';
import { TelegramConfigService } from '@libs/telegram/server';

@Injectable()
export class TransactionHelpersService {
	private readonly logger = new Logger(TransactionHelpersService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly transactionEventsService: TransactionEventsService,
		private readonly telegramService: TelegramService,
		private readonly telegramConfigService: TelegramConfigService,
	) {}

	async updateStatus(data: {
		transactionId: number;
		currentStatus?: TransactionStatusEnum;
		newStatus: TransactionStatusEnum;
		event?: TransactionEventEnum;
		broadcast?: boolean;
		purchaseInfo?: PrismaJson.TransactionPurchaseInfoType;
		errMsg?: string;
	}) {
		return this.sdkPrismaService.transaction
			.update({
				where: {
					id: data.transactionId,
					status: data.currentStatus,
				},
				data: {
					status: data.newStatus,
					purchaseInfo: data.purchaseInfo,
					logs: {
						create: {
							status: data.newStatus,
							event: data.event,
							errMsg: data.errMsg,
						},
					},
				},
				select: {
					logs: {
						take: 1,
						orderBy: {
							id: 'desc',
						},
						select: {
							...TransactionStatusLogSelectedFields,
						},
					},
				},
			})
			.then(({ logs }) => {
				this.logger.debug(`Transaction ID: ${data.transactionId} | Status changed to ${data.newStatus}`);

				if (data.broadcast) {
					this.transactionEventsService.sendToTransactionStatusStream(logs[0]);
				}
			})
			.then(() => true)
			.catch((e) => {
				this.logger.error(e);

				return false;
			});
	}

	async findBot(regionPrices: PrismaJson.RegionPricesType, regions: RegionCodeEnum[]) {
		//await $(TransactionHelpersService).findBot({"RU":177,"UA":177}, ["UA"])

		return this.sdkPrismaService.$queryRaw<{ id: number; region: RegionCodeEnum }[]>`
            SELECT bot.id, bot.region
            FROM "Bot" bot
            WHERE
				bot.region = ANY(${regions}::"RegionCodeEnum"[]) AND
				bot.status = ${BotStatusEnum.RUNNING}::"BotStatusEnum" AND
            	CASE
                        ${Prisma.raw(
							Object.keys(regionPrices)
								.flatMap((regionCode: RegionCodeEnum) => {
									if (regionPrices[regionCode] === -1 || !regions.some((region) => region === regionCode)) {
										return [];
									}

									return `WHEN bot.region = '${regionCode}'::"RegionCodeEnum" THEN bot.balance - bot."reservedBalance" >= ${regionPrices[regionCode]}`;
								})
								.join(' '),
						)}
                        ELSE false
                    END
            ORDER BY RANDOM()
            LIMIT 1
        `
			.then((bots) => bots[0] ?? null)
			.catch(() => null);
	}

	async parseSteamId64FromProfileLink(url: string, httpProxy?: string): Promise<Nullable<string>> {
		//await $(TransactionHelpersService).parseSteamId64FromProfileLink("https://steamcommunity.com/profiles/76561198030159375/")
		return axios
			.request<string>({
				url,
				httpsAgent: httpProxy ? new HttpsProxyAgent(httpProxy) : undefined,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
				},
				timeout: 10000,
			})
			.then(({ data }) => {
				const $ = Cheerio.load(data);

				const scriptTag = $('script:contains("g_rgProfileData")');
				if (scriptTag.length !== 0) {
					const jsonDataMatch = scriptTag.html()?.match(/g_rgProfileData = (\{.*\});/);
					if (jsonDataMatch) {
						try {
							const steamID = new SteamID(JSON.parse(jsonDataMatch[1]).steamid);
							if (steamID.isValid()) {
								return steamID.getSteamID64();
							}
						} catch (e) {}
					}
				}
			})
			.then((steamId64) => steamId64 ?? null)
			.catch((e) => {
				this.logger.error(e);

				return null;
			});
	}

	@Cacheable({
		ttl: 15 * 60 * 1000,
	})
	async sendNotification(invoice: number, uniqCode: string, errorCode: TransactionErrorsEnum, product?: string) {
		const config = await this.telegramConfigService.getConfig();
		if (!config.botToken || !config.balanceChatId || !config.botToken) return false;
		const message = (() => {
			switch (errorCode) {
				case TransactionErrorsEnum.BotNotFound:
					return `⚠️ Failed to find a bot for transaction #${invoice} (unique code: ${uniqCode}${
						product ? `, product: ${product}` : ''
					})`;

				default:
					return `⚠️ Failed to initialize transaction #${invoice} (unique code: ${uniqCode}${product ? `, product: ${product}` : ''})`;
			}
		})();
		await this.telegramService.sendMessage(config.botToken, config.balanceChatId, message);
		return true;
	}
}
