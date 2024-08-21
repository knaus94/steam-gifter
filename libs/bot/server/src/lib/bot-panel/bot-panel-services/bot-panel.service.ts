import { BotService } from '@libs/bot/server/lib/bot-services/bot.service';
import { CoreErrorsEnum, throwError } from '@libs/core/common';
import { ClsCustomStore, CoreError, OKDto } from '@libs/core/server';
import { ProxyHelpersService } from '@libs/proxy/server/lib/proxy-services/proxy-helpers.service';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { BotStatusEnum } from '@prisma/client';
import axios from 'axios';
import * as Cheerio from 'cheerio';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ClsService } from 'nestjs-cls';
import { BotPanelCreateArgs, BotPanelUpdateArgs } from '../bot-panel-dto/bot-panel.dto';
import { BotPanelSelectedFields } from '../bot-panel-types/bot-panel.types';

@Injectable()
export class BotPanelService {
	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly clsService: ClsService<ClsCustomStore>,
		private readonly botService: BotService,
		private readonly proxyHelpersService: ProxyHelpersService,
	) {}

	async createBot({ accountName, login, password, region, sharedSecret, steamId64, avatarUrl, proxyId }: BotPanelCreateArgs) {
		return this.sdkPrismaService.bot
			.create({
				data: {
					accountName,
					login,
					password,
					region,
					sharedSecret,
					steamId64,
					proxyId,
					avatarUrl,
					status: BotStatusEnum.STOPPED,
				},
				select: {
					...BotPanelSelectedFields,
				},
			})
			.catch(() => throwError(() => new Error('не удалось создать')));
	}

	async updateBot(botId: number, { accountName, login, password, region, sharedSecret, steamId64, avatarUrl, proxyId }: BotPanelUpdateArgs) {
		return this.sdkPrismaService.bot
			.update({
				where: {
					id: botId,
					// status: {
					// 	not: BotStatusEnum.RUNNING,
					// },
				},
				data: {
					accountName,
					login,
					password,
					region,
					sharedSecret,
					steamId64,
					avatarUrl,
					proxyId,
				},
				select: {
					...BotPanelSelectedFields,
				},
			})
			.catch(() => throwError(() => new Error('не удалось обновить, мейби бот не оставновлен')));
	}

	async deleteBot(botId: number) {
		//TODO: добавить перевод
		return this.sdkPrismaService.bot
			.delete({
				where: {
					id: botId,
				},
			})
			.then(() =>
				this.botService.shutdownBot({
					botId,
				}),
			)
			.then(() => new OKDto())
			.catch(() => throwError(() => new CoreError(CoreErrorsEnum.UnknownError, this.clsService.get().i18n)));
	}

	async parseBotInfo(steamId64: string) {
		const httpProxy = await this.proxyHelpersService.randomHttpProxy();

		return axios
			.request<string>({
				url: `https://steamcommunity.com/profiles/${steamId64}`,
				httpsAgent: httpProxy ? new HttpsProxyAgent(httpProxy.url) : undefined,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
				},
				timeout: 5000,
			})
			.then(({ data }) => {
				const $ = Cheerio.load(data);

				return {
					avatarUrl: $('#responsive_page_template_content .playerAvatar img').attr('src') ?? null,
					accountName: $('.persona_name span.actual_persona_name ').text() ?? null,
				};
			})
			.catch(() => throwError(() => new Error('не удалось получить информацию о боте')));
	}
}
