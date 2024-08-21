import { buildProxy } from '@libs/proxy/common/lib/proxy-utils/build-proxy.utils';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { Prisma, Proxy } from '@prisma/client';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ProxyPanelArgs, ProxyPanelSortEnum } from '../proxy-panel-dto/proxy-panel.dto';
import { ProxyPanelSelectedFields } from '../proxy-panel-types/proxy-panel.types';

@Injectable()
export class ProxyPanelHelpersService {
	constructor(private readonly sdkPrismaService: SdkPrismaService) {}

	async getProxies({ take, skip, address, sort, isValid }: ProxyPanelArgs) {
		const where: Prisma.ProxyWhereInput = {
			address: address
				? {
						contains: address,
				  }
				: undefined,
			isValid: isValid !== undefined ? isValid : undefined,
		};

		return Promise.all([
			this.sdkPrismaService.proxy.findMany({
				where,
				skip,
				take,
				orderBy:
					sort.field === ProxyPanelSortEnum.bots
						? {
								bots: {
									_count: sort.type,
								},
						  }
						: sort.field === ProxyPanelSortEnum.id
						? {
								id: sort.type,
						  }
						: undefined,
				select: {
					...ProxyPanelSelectedFields,
				},
			}),
			this.sdkPrismaService.proxy.count({
				where,
			}),
		]).then(([records, total]) => ({ records, total }));
	}

	async getCountBots(proxyId: number) {
		return this.sdkPrismaService.bot.count({
			where: {
				proxyId,
			},
		});
	}

	async validateProxy(data: Pick<Proxy, 'address' | 'password' | 'port' | 'username'>) {
		return axios
			.request({
				url: 'https://store.steampowered.com/login/',
				httpsAgent: new HttpsProxyAgent(buildProxy(data)),
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
				},
				timeout: 5000,
			})
			.then(() => true)
			.catch(() => false);
	}
}
