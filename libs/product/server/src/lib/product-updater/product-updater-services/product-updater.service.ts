import { tuple } from '@libs/core/common';
import { ProxyHelpersService } from '@libs/proxy/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { createSlackDoneAttachments, createSlackErrorAttachments } from '@libs/slack/common';
import { SlackService } from '@libs/slack/server';
import { Injectable, Logger } from '@nestjs/common';
import { ProductsPriceUpdatedEventInterface } from '../product-updater-interfaces/product-price-updated.interface';
import { ProductUpdaterEventsService } from './product-updater-events.service';
import { ProductUpdaterHelpersService } from './product-updater-helpers.service';

@Injectable()
export class ProductUpdaterService {
	private readonly logger = new Logger(ProductUpdaterService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly productUpdaterHelpersService: ProductUpdaterHelpersService,
		private readonly proxyHelpersService: ProxyHelpersService,
		private readonly productUpdaterEventsService: ProductUpdaterEventsService,
		private readonly slackService: SlackService,
	) {}

	//await $(ProductPriceUpdaterBootstrapService).updatePrices()
	async updatePrices(force = false) {
		this.logger.debug(`Process update prices for apps is started`);
		const products = await this.sdkPrismaService.product.findMany({
			where: {
				autoSync: {
					isEmpty: false,
				},
			},
			select: {
				id: true,
				identifier: true,
				autoSync: true,
				prices: true,
				isBundle: true,
				name: true,
			},
		});

		if (!products.length) {
			return;
		}

		const apps = products.filter(({ isBundle }) => !isBundle);
		const bundles = products.filter(({ isBundle }) => isBundle);

		//собираем цены всех продуктов по регионам
		const appPrices: Record<number, PrismaJson.RegionPricesType> = {};
		const bundlePrices: Record<number, PrismaJson.RegionPricesType> = {};

		//Цены игр
		for (const { identifier, autoSync } of apps) {
			const [price, error] = await tuple(
				this.productUpdaterHelpersService.getPackagePrices(
					identifier,
					autoSync,
					await this.proxyHelpersService.randomHttpProxy().then((proxy) => proxy?.url),
				),
			);
			// console.log(`getting price for ${identifier}, ${JSON.stringify(price)} | ${error}`);

			if (!error && price) {
				appPrices[identifier] = price;
			}
		}

		//Цены бандлов
		for (const { identifier, autoSync } of bundles) {
			const [price, error] = await tuple(
				this.productUpdaterHelpersService.getBundlePrices(
					identifier,
					autoSync,
					await this.proxyHelpersService.randomHttpProxy().then((proxy) => proxy?.url),
				),
			);
			// console.log(`getting price for ${identifier}, ${JSON.stringify(price)} | ${error}`);

			if (!error && price) {
				bundlePrices[identifier] = price;
			}
		}

		const data: ProductsPriceUpdatedEventInterface['products'] = [];
		for (const { id, identifier, autoSync, prices, isBundle, name } of products) {
			let updated = force;

			const regionsPrice = isBundle ? bundlePrices[identifier] : appPrices[identifier];
			if (regionsPrice) {
				for (const region of autoSync) {
					const price = regionsPrice[region];
					if (price && price !== -1 && prices[region] !== price) {
						prices[region] = price;

						updated = true;

						// console.log(`new price for ${name} in ${region} is ${price}`);
					}
				}
			}

			if (!updated) {
				continue;
			}

			data.push({
				id,
				prices,
				name,
				isBundle,
			});
		}

		if (data.length !== 0) {
			await this.sdkPrismaService
				.$transaction(data.map(({ id, prices }) => this.sdkPrismaService.product.update({ where: { id }, data: { prices } })))
				.then(() => this.productUpdaterEventsService.sendToProductsPriceUpdatedStream({ products: data }))
				.then(() =>
					this.slackService.send({
						attachments: createSlackDoneAttachments(
							{ name: ProductUpdaterService.name, message: `Successful updated prices for ${data.length} apps` },
							{},
							{ application: 'server' },
						),
					}),
				)
				.then(() => this.logger.debug(`Price updated for: ${data.length} apps`))
				.catch((e) => {
					this.logger.error(e);
					this.slackService.send({
						attachments: createSlackErrorAttachments(
							{ name: ProductUpdaterService.name, message: e },
							{},
							{ application: 'server' },
						),
					});
				});
		}
	}
}
