import { Cacheable } from '@knaus94/nestjs-cacheable';
import { ConfigErrorsEnum } from '@libs/config/common';
import { ConfigError } from '@libs/config/server';
import { throwError } from '@libs/core/common';
import { ClsCustomStore, getGlobalI18nService } from '@libs/core/server';
import { DigisellerConfigSelectedFields } from '@libs/digiseller/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class DigisellerConfigService {
	private readonly logger = new Logger(DigisellerConfigService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly clsService: ClsService<ClsCustomStore>,
	) {}

	@Cacheable({
		namespace: DigisellerConfigService.name,
		ttl: 15 * 60 * 1000,
		key: `config`,
	})
	async getConfig() {
		return this.sdkPrismaService.digisellerConfig
			.findFirstOrThrow({
				select: {
					...DigisellerConfigSelectedFields,
				},
			})
			.catch(() => throwError(() => new ConfigError(ConfigErrorsEnum.NotFound, this.clsService.get().i18n ?? getGlobalI18nService)));
	}
}
