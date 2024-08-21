import { Nullable } from '@libs/core/common';
import { REGION_CURRENCY, STEAM_USER_CURRENCY_REGION } from '@libs/region/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger } from '@nestjs/common';
import { BotErrCodeEnum, BotStatusEnum } from '@prisma/client';
import { ECurrencyCode } from 'steam-user';
import { BotLoginSelectedFields } from '../bot-types/bot-login.types';
import { BotSelectedFields } from '../bot-types/bot.types';
import { BotEventsService } from './bot-events.service';

@Injectable()
export class BotHelpersService {
	private readonly logger = new Logger(BotHelpersService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly botEventsService: BotEventsService,
	) {}

	async setStatus(
		botId: number,
		status: BotStatusEnum,
		errCode: Nullable<BotErrCodeEnum> = null,
		errMsg: Nullable<string> = null,
		proxyId?: number,
	) {
		return this.sdkPrismaService.bot
			.update({
				where: {
					id: botId,
					OR: [
						{
							status: {
								not: status,
							},
						},
						{
							errMsg: {
								not: errMsg,
							},
						},
					],
				},
				data: {
					status,
					errCode,
					errMsg,
					proxyId,
				},
				select: {
					...BotSelectedFields,
				},
			})
			.then((bot) => this.botEventsService.sendToBotStatusStream({ bot, newStatus: status, errCode, errMsg }))
			.catch(() => {});
	}

	async handleUpdateWalletBalance(botId: number, currency: ECurrencyCode, newBalance: number) {
		const regionCode = STEAM_USER_CURRENCY_REGION[currency];

		if (!regionCode) {
			return;
		}

		return this.sdkPrismaService.bot
			.update({
				where: {
					id: botId,
					region: regionCode,
				},
				data: {
					balance: newBalance,
				},
				select: {
					...BotLoginSelectedFields,
				},
			})
			.then((bot) => this.botEventsService.sendToBotWalletBalanceStream({ bot, newBalance }))
			.then(() =>
				this.logger.debug(`🤖 Bot ID: ${botId} | Balance Update | 💰 Current Balance: ${newBalance} ${REGION_CURRENCY[regionCode]}`),
			)
			.catch(() => {});
	}
}
