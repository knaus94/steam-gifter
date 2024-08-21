import { Cacheable } from '@knaus94/nestjs-cacheable';
import { buildProxy } from '@libs/proxy/common/lib/proxy-utils/build-proxy.utils';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class ProxyHelpersService {
	constructor(private readonly sdkPrismaService: SdkPrismaService) {}

	async randomHttpProxy() {
		return this.getProxies()
			.then((proxies) => {
				const i = randomInt(0, proxies.length);
				const proxy = proxies[i];
				if (!proxy) {
					return undefined;
				}

				return {
					...proxy,
					url: buildProxy(proxy),
				};
			})
			.catch(() => undefined);
	}

	@Cacheable({
		ttl: 5 * 60 * 1000,
		key: 'proxies',
	})
	async getProxies() {
		return this.sdkPrismaService.proxy.findMany({
			where: {
				isValid: true,
			},
		});
	}
}
