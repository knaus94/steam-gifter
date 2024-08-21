import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BotStatusEnum } from '@prisma/client';
import { BotLoginSelectedFields } from '../bot-types/bot-login.types';
import { BotService } from './bot.service';

@Injectable()
export class BotBootstrapService implements OnApplicationBootstrap {
	private readonly logger = new Logger(BotBootstrapService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly botService: BotService,
	) {}

	onApplicationBootstrap() {
		this.logger.log('onApplicationBootstrap');

		this.sdkPrismaService.bot
			.findMany({
				where: {
					status: {
						not: BotStatusEnum.STOPPED,
					},
				},
				select: {
					...BotLoginSelectedFields,
				},
			})
			.then(async (bots) => {
				for (const bot of bots) {
					await this.botService.logIn(bot);
				}
			});
	}

	@Cron(CronExpression.EVERY_30_MINUTES)
	async checkEmptyBots() {
		const bots = await this.sdkPrismaService.bot.findMany({
			where: {
				status: BotStatusEnum.RUNNING,
				balance: 0,
			},
			select: {
				id: true,
			},
		});

		for (const bot of bots) {
			await this.botService.shutdownBot({
				botId: bot.id,
				setStatus: true,
			});
		}
	}
}
