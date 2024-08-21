import { Cacheable, CacheEvict } from '@knaus94/nestjs-cacheable';
import { ConfigErrorsEnum } from '@libs/config/common';
import { ConfigError } from '@libs/config/server';
import { roundNumber, throwError } from '@libs/core/common';
import { ClsCustomStore, OKDto } from '@libs/core/server';
import { REGION_COURSES_TO_RUB_CONSTANTS } from '@libs/product/server';
import { ProxyHelpersService } from '@libs/proxy/server/lib/proxy-services/proxy-helpers.service';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { DigisellerProductSelectedFields, DigisellerProductType } from '../digiseller-types/digiseller.types';
import DigisellerWebApi from '../digiseller-web-api/digiseller-web-api';
import { DigisellerConfigService } from './digiseller-config.service';

@Injectable()
export class DigisellerService {
	private readonly logger = new Logger(DigisellerService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly digisellerConfigService: DigisellerConfigService,
		private readonly clsService: ClsService<ClsCustomStore>,
		private readonly proxyHelpersService: ProxyHelpersService,
	) {}

	@Cacheable({
		namespace: DigisellerService.name,
		ttl: 15 * 60 * 1000,
	})
	async findUniqCode(uniqCode: string) {
		return this.createClient()
			.then((client) => client.checkCode(uniqCode))
			.catch(() => throwError(() => new ConfigError(ConfigErrorsEnum.NotFound, this.clsService.get().i18n)));
	}

	@CacheEvict({
		namespace: DigisellerConfigService.name,
		key: `config`,
	})
	async updateToken(client: DigisellerWebApi) {
		try {
			const config = await this.digisellerConfigService.getConfig();
			const token = await client.getToken();
			client.setToken(token);

			return this.sdkPrismaService.digisellerConfig
				.update({
					where: {
						id: config.id,
					},
					data: {
						token,
						tokenUpdatedAt: new Date(),
					},
				})
				.then(() => true);
		} catch (e) {
			return false;
		}
	}

	async createClient() {
		const config = await this.digisellerConfigService.getConfig();
		if (!config.sellerId || !config.apiKey) {
			throw new Error('Config not set');
		}

		const client = new DigisellerWebApi({
			sellerId: config.sellerId,
			apikey: config.apiKey,
			token: config.token ?? undefined,
			httpProxy: await this.proxyHelpersService.randomHttpProxy().then((proxy) => proxy?.url),
		});
		if (!config.token || !config.tokenUpdatedAt || config.tokenUpdatedAt < new Date(Date.now() - 1.5 * 60 * 60 * 1000)) {
			await this.updateToken(client).then((result) => !result && throwError(() => new Error('Error update token')));
		}

		return client;
	}

	async updatePrices(products?: DigisellerProductType[]) {
		if (!products) {
			products = await this.sdkPrismaService.digisellerProductEdition
				.findMany({
					where: {
						isDeleted: false,
						isDefault: true,
						digisellerProduct: {
							syncPrice: true,
						},
					},
					select: {
						digisellerProduct: {
							select: {
								...DigisellerProductSelectedFields,
							},
						},
					},
				})
				.then((products) => [...new Set(products.map(({ digisellerProduct }) => digisellerProduct))]);
		}

		if (products?.length === 0) {
			return new OKDto();
		}

		await this.createClient()
			.then((client) =>
				client.updatePrices(
					products!.flatMap(({ editions, syncPricePercent, syncPriceRegion, digisellerId }) => {
						const price = editions[0]?.product?.prices[syncPriceRegion];

						if (!price) {
							return [];
						}

						return {
							digisellerId,
							price: roundNumber(
								Math.floor(price * REGION_COURSES_TO_RUB_CONSTANTS[syncPriceRegion] * (1 + (syncPricePercent - 100) / 100)),
							),
						};
					}),
				),
			)
			.catch((e) => this.logger.error(e));

		return new OKDto();
	}
}
