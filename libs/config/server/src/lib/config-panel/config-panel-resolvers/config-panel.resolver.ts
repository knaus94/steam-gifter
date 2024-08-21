import { AuthGuard, CurrentUser, CurrentUserType } from '@libs/auth/server';
import { ConfigPanelUpdateArgs, ConfigService } from '@libs/config/server';
import { OKDto } from '@libs/core/server';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ConfigDto } from '../../config-dto/config.dto';
import { ConfigPanelService } from '../config-panel-services/config-panel.service';

@Resolver()
@UseGuards(AuthGuard)
export class ConfigPanelResolver {
	constructor(
		private readonly configService: ConfigService,
		private readonly configPanelService: ConfigPanelService,
	) {}

	@Query(() => ConfigDto, { name: 'panelConfig' })
	getConfig(): Promise<ConfigDto> {
		return this.configService.getConfig();
	}

	@Mutation(() => OKDto, { name: 'panelConfigUpdate' })
	updateConfig(
		@Args({
			name: 'args',
			type: () => ConfigPanelUpdateArgs,
		})
		args: ConfigPanelUpdateArgs,
	): Promise<OKDto> {
		return this.configPanelService.update(args);
	}
}
