import { CacheEvict } from '@knaus94/nestjs-cacheable';
import { BotLoginSelectedFields, BotService } from '@libs/bot/server';
import { throwError } from '@libs/core/common';
import { OKDto } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { BotStatusEnum } from '@prisma/client';
import { ProxyPanelCreateArgs } from '../proxy-panel-dto/proxy-panel.dto';
import { ProxyPanelSelectedFields } from '../proxy-panel-types/proxy-panel.types';
import { ProxyPanelHelpersService } from './proxy-panel-helpers.service';

@Injectable()
export class ProxyPanelService {
	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly botService: BotService,
		private readonly proxyPanelHelpersService: ProxyPanelHelpersService,
	) {}

	@CacheEvict({
		key: 'proxies',
	})
	async deleteProxy(proxyId: number) {
		//Получаем ботов которые используют данные прокси
		const bots = await this.sdkPrismaService.bot.findMany({
			where: {
				proxyId,
				OR: [
					{
						status: BotStatusEnum.RUNNING,
					},
					{
						status: BotStatusEnum.STARTING,
					},
				],
			},
			select: {
				...BotLoginSelectedFields,
				status: true,
			},
		});

		//Удаляем проксю
		return this.sdkPrismaService.proxy
			.delete({
				where: {
					id: proxyId,
				},
			})
			.then(() => {
				setTimeout(async () => {
					//Цикл по запущенным ботам с данной проксей
					for (const bot of bots) {
						//Вырубаем ботов, Запускаем на фоне апдейт прокси и перелогин
						await this.botService
							.shutdownBot({
								botId: bot.id,
								setStatus: true,
							})
							.then(() => this.botService.logIn(bot));
					}
				}, 0);
			})
			.then(() => new OKDto())
			.catch(() => {
				throw new Error('Не удалось удалить либо проксей не существует');
			});
	}

	@CacheEvict({
		key: 'proxies',
	})
	async createProxy(data: ProxyPanelCreateArgs) {
		return this.proxyPanelHelpersService.validateProxy(data).then((result) =>
			result
				? this.sdkPrismaService.proxy.create({
						data,
						select: {
							...ProxyPanelSelectedFields,
						},
				  })
				: throwError(() => new Error('Прокси не валидна')),
		);
	}
}
