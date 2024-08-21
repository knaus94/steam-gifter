import { AuthGuard } from '@libs/auth/server/lib/auth-guards/auth.guard';
import { OKDto } from '@libs/core/server';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProxyPanelArgs, ProxyPanelCreateArgs, ProxyPanelDto, ProxyPanelPaginatedDto } from '../proxy-panel-dto/proxy-panel.dto';
import { ProxyPanelHelpersService } from '../proxy-panel-services/proxy-panel-helpers.service';
import { ProxyPanelService } from '../proxy-panel-services/proxy-panel.service';

@Resolver(() => ProxyPanelDto)
@UseGuards(AuthGuard)
export class ProxyPanelResolver {
	constructor(
		private readonly proxyPanelService: ProxyPanelService,
		private readonly proxyPanelHelpersService: ProxyPanelHelpersService,
	) {}

	@Query(() => ProxyPanelPaginatedDto, { name: 'panelProxies' })
	getProxies(
		@Args({
			name: 'args',
			type: () => ProxyPanelArgs,
		})
		args: ProxyPanelArgs,
	): Promise<ProxyPanelPaginatedDto> {
		return this.proxyPanelHelpersService.getProxies(args);
	}

	@Mutation(() => ProxyPanelDto, { name: 'panelCreateProxy' })
	createProxy(
		@Args({
			name: 'args',
			type: () => ProxyPanelCreateArgs,
		})
		args: ProxyPanelCreateArgs,
	): Promise<ProxyPanelDto> {
		return this.proxyPanelService.createProxy(args);
	}

	@Mutation(() => OKDto, { name: 'panelDeleteProxy' })
	deleteProxy(@Args('proxyId', { type: () => Int }) proxyId: number): Promise<OKDto> {
		return this.proxyPanelService.deleteProxy(proxyId);
	}

	@ResolveField(() => Int, { name: 'countBots' })
	getBotsCount(@Parent() { id }: ProxyPanelDto) {
		return this.proxyPanelHelpersService.getCountBots(id);
	}
}
