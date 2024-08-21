import { ProductUpdaterEventsService } from '@libs/product/server';
import { ProxyHelpersService } from '@libs/proxy/server/lib/proxy-services/proxy-helpers.service';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { DigisellerProductSelectedFields } from '../digiseller-types/digiseller.types';
import DigisellerWebApi from '../digiseller-web-api/digiseller-web-api';
import { DigisellerService } from './digiseller.service';

@Injectable()
export class DigisellerBootstrapService implements OnApplicationBootstrap {
	private readonly logger = new Logger(DigisellerBootstrapService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly digisellerService: DigisellerService,
		private readonly proxyHelpersService: ProxyHelpersService,
		private readonly productUpdaterEventsService: ProductUpdaterEventsService,
	) {}

	onApplicationBootstrap() {
		this.logger.log('onApplicationBootstrap');
		this.subscribeToListenProductsPriceUpdatedStream();
	}

	/**
	 * Апдейт цен диги
	 */
	private subscribeToListenProductsPriceUpdatedStream() {
		this.logger.debug('subscribeToListenProductsPriceUpdatedStream');
		this.productUpdaterEventsService.listenProductsPriceUpdatedStream().subscribe(async ({ products: _products }) => {
			const products = await this.sdkPrismaService.digisellerProductEdition
				.findMany({
					where: {
						isDeleted: false,
						isDefault: true,
						digisellerProduct: {
							syncPrice: true,
						},
						productId: {
							in: _products.map(({ id }) => id),
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

			if (!products.length) {
				return;
			}

			await this.digisellerService.updatePrices(products);
		});
	}

	/**
	 * Обновление токенов
	 */
	@Interval(5 * 60 * 1000)
	private async updateTokens() {
		const configs = await this.sdkPrismaService.digisellerConfig.findMany({
			where: {
				sellerId: {
					not: null,
				},
				apiKey: {
					not: null,
				},
				OR: [
					{
						token: null,
					},
					{
						tokenUpdatedAt: {
							gt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
						},
					},
				],
			},
			select: {
				sellerId: true,
				apiKey: true,
			},
		});

		for (const config of configs) {
			await this.digisellerService.updateToken(
				new DigisellerWebApi({
					sellerId: config.sellerId!,
					apikey: config.apiKey!,
					httpProxy: await this.proxyHelpersService.randomHttpProxy().then((proxy) => proxy?.url),
				}),
			);
		}
	}
}
