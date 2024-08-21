import { CacheEvict } from '@knaus94/nestjs-cacheable';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { createSlackDoneAttachments, createSlackPauseAttachments } from '@libs/slack/common';
import { SlackService } from '@libs/slack/server';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProxyService } from '../../proxy-services/proxy.service';
import { ProxyPanelHelpersService } from './proxy-panel-helpers.service';

@Injectable()
export class ProxyPanelBootstrapService implements OnApplicationBootstrap {
	private readonly logger = new Logger(ProxyPanelBootstrapService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly proxyPanelHelpersService: ProxyPanelHelpersService,
		private readonly slackService: SlackService,
	) {}

	async onApplicationBootstrap() {
		this.logger.log('onApplicationBootstrap');
	}

	@Cron(CronExpression.EVERY_30_MINUTES)
	@CacheEvict({
		key: 'proxies',
	})
	async validateProxies() {
		const proxies = await this.sdkPrismaService.proxy.findMany({});

		const results: Record<number, boolean> = {};
		for (const proxy of proxies) {
			await this.proxyPanelHelpersService.validateProxy(proxy).then((result) => {
				if (proxy.isValid !== result) {
					results[proxy.id] = result;
				}
			});
		}

		await this.sdkPrismaService.$transaction(
			Object.keys(results).map((id) =>
				this.sdkPrismaService.proxy.update({
					where: {
						id: parseInt(id),
					},
					data: {
						isValid: results[id],
					},
				}),
			),
		);

		const values = Object.keys(results);
		if (values.length > 0) {
			for (const id of values) {
				switch (results[id]) {
					case true:
						this.slackService.send({
							attachments: createSlackDoneAttachments(
								{ name: ProxyService.name, message: `ID:${id} is available again` },
								{},
								{ application: 'server' },
							),
						});
						break;

					case false:
						this.slackService.send({
							attachments: createSlackPauseAttachments(
								{ name: ProxyService.name, message: `ID:${id} is down` },
								{},
								{ application: 'server' },
							),
						});
						break;
				}
			}
		}
	}
}
