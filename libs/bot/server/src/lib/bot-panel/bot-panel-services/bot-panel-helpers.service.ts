import { BotPanelArgs, BotPanelSortEnum } from '@libs/bot/server/lib/bot-panel/bot-panel-dto/bot-panel.dto';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { BotStatusEnum, Prisma } from '@prisma/client';
import { BotPanelSelectedFields } from '../bot-panel-types/bot-panel.types';

@Injectable()
export class BotPanelHelpersService {
	constructor(private readonly sdkPrismaService: SdkPrismaService) {}

	async getBots({ skip, take, login, sort, steamId64, status }: BotPanelArgs) {
		const where: Prisma.BotWhereInput = {
			login: login
				? {
						contains: login,
				  }
				: undefined,
			steamId64: steamId64
				? {
						contains: steamId64,
				  }
				: undefined,
			status,
		};

		return Promise.all([
			this.sdkPrismaService.bot.findMany({
				where,
				skip,
				take,
				orderBy:
					sort.field === BotPanelSortEnum.id
						? {
								id: sort.type,
						  }
						: undefined,
				select: {
					...BotPanelSelectedFields,
				},
			}),
			this.sdkPrismaService.bot.count({
				where,
			}),
		]).then(([records, total]) => ({ records, total }));
	}

	async getBot(id: number) {
		return this.sdkPrismaService.bot.findUnique({
			where: { id },
			select: {
				...BotPanelSelectedFields,
			},
		});
	}

	async getCountBotsOnline() {
		return this.sdkPrismaService.bot.count({
			where: {
				status: BotStatusEnum.RUNNING,
			},
		});
	}
}
