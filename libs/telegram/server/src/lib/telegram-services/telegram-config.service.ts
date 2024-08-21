import { Cacheable } from '@knaus94/nestjs-cacheable';
import { ConfigErrorsEnum } from '@libs/config/common';
import { ConfigError } from '@libs/config/server';
import { throwError } from '@libs/core/common';
import { ClsCustomStore, getGlobalI18nService } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TelegramConfigSelectedFields } from '../telegram-types/telegram-config.types';

@Injectable()
export class TelegramConfigService {
	private readonly logger = new Logger(TelegramConfigService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly clsService: ClsService<ClsCustomStore>,
	) {}

	@Cacheable({
		namespace: TelegramConfigService.name,
		ttl: 15 * 60 * 1000,
		key: `config`,
	})
	async getConfig() {
		return this.sdkPrismaService.telegramConfig
			.findFirstOrThrow({
				select: {
					...TelegramConfigSelectedFields,
				},
			})
			.catch(() => throwError(() => new ConfigError(ConfigErrorsEnum.NotFound, this.clsService.get().i18n ?? getGlobalI18nService)));
	}
}
