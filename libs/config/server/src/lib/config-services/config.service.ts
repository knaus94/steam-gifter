import { Cacheable } from '@knaus94/nestjs-cacheable';
import { ConfigErrorsEnum } from '@libs/config/common';
import { throwError } from '@libs/core/common';
import { ClsCustomStore } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ConfigError } from '../config-errors/config-error';
import { ConfigSelectedFields } from '../config-types/config.types';

@Injectable()
export class ConfigService {
	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly clsService: ClsService<ClsCustomStore>,
	) {}

	@Cacheable({
		namespace: ConfigService.name,
		ttl: 15 * 60 * 1000,
		key: `config`,
	})
	async getConfig() {
		return this.sdkPrismaService.config
			.findFirstOrThrow({
				select: {
					...ConfigSelectedFields,
				},
			})
			.catch(() => throwError(() => new ConfigError(ConfigErrorsEnum.NotFound, this.clsService.get().i18n)));
	}
}
