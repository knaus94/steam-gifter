import { throwError } from '@libs/core/common';
import { OKDto } from '@libs/core/server';
import { ProxyHelpersService } from '@libs/proxy/server/lib/proxy-services/proxy-helpers.service';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { Prisma, RegionCodeEnum } from '@prisma/client';
import axios from 'axios';
import { load } from 'cheerio';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ProductUpdaterHelpersService } from '../../product-updater/product-updater-services/product-updater-helpers.service';
import { ProductUpdaterService } from '../../product-updater/product-updater-services/product-updater.service';
import { ProductPanelArgs, ProductPanelCreateArgs, ProductPanelSortEnum, ProductPanelUpdateArgs } from '../product-panel-dto/product-panel.dto';
import { ProductPanelSelectedFields } from '../product-panel-types/product-panel.types';

@Injectable()
export class ProductPanelService {
	constructor(
		private readonly productUpdaterHelpersService: ProductUpdaterHelpersService,
		private readonly proxyHelpersService: ProxyHelpersService,
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly productUpdaterService: ProductUpdaterService,
	) {}

	async getProducts({ sort, skip, take, name }: ProductPanelArgs) {
		const where: Prisma.ProductWhereInput = {
			name: name
				? {
						contains: name,
						mode: 'insensitive',
				  }
				: undefined,
		};

		return Promise.all([
			this.sdkPrismaService.product.findMany({
				where,
				skip,
				take,
				orderBy:
					sort.field === ProductPanelSortEnum.id
						? {
								id: sort.type,
						  }
						: undefined,
				select: {
					...ProductPanelSelectedFields,
				},
			}),
			this.sdkPrismaService.product.count({
				where,
			}),
		]).then(([records, total]) => ({ records, total }));
	}

	async getProduct(productId: number) {
		return this.sdkPrismaService.product.findUnique({
			where: {
				id: productId,
			},
			select: {
				...ProductPanelSelectedFields,
			},
		});
	}

	async getPackagePrices(packageId: number) {
		const prices = await this.productUpdaterHelpersService
			.getPackagePrices(
				packageId,
				Object.values(RegionCodeEnum),
				await this.proxyHelpersService.randomHttpProxy().then((proxy) => proxy?.url),
			)
			.then((prices) => {
				if (Object.keys(prices).length === 0 || Object.values(prices).every((price) => price === -1)) {
					throw new Error('No prices found');
				}

				return prices;
			})
			.then((prices) =>
				Object.keys(prices).flatMap((region: RegionCodeEnum) => {
					const price = prices[region] as number;

					if (!price || price === -1) {
						return [];
					}

					return {
						region,
						price,
					};
				}),
			);

		return {
			name: await this.getIdentifierProductName(packageId, false),
			prices,
		};
	}

	async getBundlePrices(bundleId: number) {
		const prices = await this.productUpdaterHelpersService
			.getBundlePrices(
				bundleId,
				Object.values(RegionCodeEnum),
				await this.proxyHelpersService.randomHttpProxy().then((proxy) => proxy?.url),
			)
			.then((prices) => {
				if (Object.keys(prices).length === 0 || Object.values(prices).every((price) => price === -1)) {
					throw new Error('No prices found');
				}

				return prices;
			})
			.then((prices) =>
				Object.keys(prices).flatMap((region: RegionCodeEnum) => {
					const price = prices[region] as number;

					if (!price || price === -1) {
						return [];
					}

					return {
						region,
						price,
					};
				}),
			);

		return {
			name: await this.getIdentifierProductName(bundleId, true),
			prices,
		};
	}

	/**
	 * Парс имени
	 */
	async getIdentifierProductName(identifier: number, isBundle: boolean) {
		const httpProxy = await this.proxyHelpersService.randomHttpProxy();

		return axios
			.get<string>(`https://store.steampowered.com/${isBundle ? 'bundle' : 'sub'}/${identifier}/?cc=US`, {
				timeout: 10 * 1000,
				httpsAgent: httpProxy ? new HttpsProxyAgent(httpProxy.url) : undefined,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
					Cookie: `birthtime=0; lastagecheckage=1-0-1988`,
				},
			})
			.then(({ data }) => {
				const $ = load(data);

				const name = $('#tabletGrid div div div h2.pageheader').text().trim();
				return !name || name === '' ? null : name;
			})
			.catch(() => null);
	}

	async createProduct({ isBundle, identifier }: ProductPanelCreateArgs) {
		const app = await (async () => {
			if (isBundle) {
				return this.getBundlePrices(identifier);
			}

			return this.getPackagePrices(identifier);
		})();

		const prices: PrismaJson.RegionPricesType = {};
		for (const { region, price } of app.prices) {
			prices[region] = price;
		}

		return this.sdkPrismaService.product.create({
			data: {
				autoSync: Object.values(RegionCodeEnum),
				name: app.name ?? `${isBundle ? 'BUNDLE' : 'APP'}-${identifier}`,
				isBundle,
				identifier,
				prices,
			},
			select: {
				...ProductPanelSelectedFields,
			},
		});
	}

	async updateProduct(productId: number, { autoSync, name, prices: _prices, isBundle, identifier }: ProductPanelUpdateArgs) {
		const prices: PrismaJson.RegionPricesType = {};
		for (const { region, price } of _prices) {
			prices[region] = price;
		}

		return this.sdkPrismaService.product
			.update({
				where: {
					id: productId,
				},
				data: {
					autoSync,
					name,
					isBundle,
					identifier,
					prices,
				},
				select: {
					...ProductPanelSelectedFields,
				},
			})
			.catch(() => throwError(() => new Error('не удалось обновить')));
	}

	async deleteProduct(productId: number) {
		return this.sdkPrismaService.product
			.delete({
				where: {
					id: productId,
				},
			})
			.then(() => new OKDto())
			.catch(() => throwError(() => new Error('не удалось удалить')));
	}

	async updatePrices() {
		this.productUpdaterService.updatePrices(true).then(() => {});

		return new OKDto();
	}
}
