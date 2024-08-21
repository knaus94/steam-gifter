import { roundNumber } from '@libs/core/common';
import { GameInfoResponse } from '@libs/product/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { RegionCodeEnum } from '@prisma/client';
import axios from 'axios';
import { load } from 'cheerio';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class ProductUpdaterHelpersService {
	constructor(private readonly sdkPrismaService: SdkPrismaService) {}

	//await $(ProductUpdaterHelpersService).getPackagePrices(367653, ['RU', 'TR', 'UA'])
	async getPackagePrices(packageId: number, regions: RegionCodeEnum[], httpProxy?: string) {
		const result: PrismaJson.RegionPricesType = {};
		for (const region of regions) {
			result[region] = await this.getPackagesPrice(packageId, region, httpProxy);
		}

		return result;
	}

	async getBundlePrices(bundleId: number, regions: RegionCodeEnum[], httpProxy?: string) {
		const result: PrismaJson.RegionPricesType = {};
		for (const region of regions) {
			result[region] = await this.getBundlePrice(bundleId, region, httpProxy);
		}

		return result;
	}

	/**
	 * Парс цен пакетов по региону
	 * @description Возвращает в цене -1, если не удалось получить
	 */
	async getPackagesPrice(packageId: number, region: RegionCodeEnum, httpProxy?: string) {
		return axios
			.get<GameInfoResponse>(
				`https://store.steampowered.com/api/packagedetails?packageids=${packageId}&cc=${region}&filters=price_overview`,
				{
					timeout: 10 * 1000,
					httpsAgent: httpProxy ? new HttpsProxyAgent(httpProxy) : undefined,
					headers: {
						'User-Agent':
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
						Cookie: `birthtime=0; lastagecheckage=1-0-1988`,
					},
				},
			)
			.then(({ data }) => {
				let price: number = -1;

				const finalPrice = data[packageId]?.data?.price_overview?.final ?? data[packageId]?.data?.price?.final;
				if (finalPrice && finalPrice > 0) {
					price = roundNumber(finalPrice / 100);
				}

				return price;
			})
			.catch(() => -1);
	}

	/**
	 * Парс цены бандла по региону
	 * @description Возвращает -1, если не удалось получить
	 */
	async getBundlePrice(bundleId: number, region: RegionCodeEnum, httpProxy?: string) {
		return axios
			.get<string>(`https://store.steampowered.com/bundle/${bundleId}?cc=${region}`, {
				timeout: 10 * 1000,
				httpsAgent: httpProxy ? new HttpsProxyAgent(httpProxy) : undefined,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
					Cookie: `birthtime=0; lastagecheckage=1-0-1988`,
				},
			})
			.then(({ data }) => {
				const value = load(data)('.game_purchase_action div [data-price-final]').attr('data-price-final');
				if (value) {
					const price = parseInt(value);
					if (!isNaN(price) && price > 0) {
						return roundNumber(price / 100);
					}
				}

				return -1;
			})
			.catch(() => -1);
	}
}
