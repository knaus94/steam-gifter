import { CacheEvict } from '@knaus94/nestjs-cacheable';
import { ConfigPanelUpdateArgs, ConfigService } from '@libs/config/server';
import { OKDto } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigPanelService {
	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly configService: ConfigService,
	) {}

	@CacheEvict({
		namespace: ConfigService.name,
		key: `config`,
	})
	async update({ skypeLink, supportLink, telegramLogin, vkLink, email, discordLink }: ConfigPanelUpdateArgs) {
		return this.configService
			.getConfig()
			.then(({ id }) =>
				this.sdkPrismaService.config.update({
					where: {
						id,
					},
					data: {
						skypeLink,
						supportLink,
						telegramLogin,
						vkLink,
						email,
						discordLink,
					},
				}),
			)
			.then(() => new OKDto());
	}
}
