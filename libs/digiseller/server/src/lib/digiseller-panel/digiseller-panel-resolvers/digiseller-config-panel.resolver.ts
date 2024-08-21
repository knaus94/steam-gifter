import { CurrentUser, CurrentUserType } from '@libs/auth/server';
import { AuthGuard } from '@libs/auth/server/lib/auth-guards/auth.guard';
import { OKDto } from '@libs/core/server';
import { DigisellerConfigPanelService } from '@libs/digiseller/server/lib/digiseller-panel/digiseller-panel-services/digiseller-config-panel.service';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DigisellerConfigService } from '../../digiseller-services/digiseller-config.service';
import {
	DigisellerConfigPanelDto,
	DigisellerConfigUpdatePanelArgs,
	DigisellerRegionPanelDto,
} from '../digiseller-panel-dto/digiseller-config-panel.dto';

@Resolver(DigisellerConfigPanelDto)
@UseGuards(AuthGuard)
export class DigisellerConfigPanelResolver {
	constructor(
		private readonly digisellerConfigPanelService: DigisellerConfigPanelService,
		private readonly digisellerConfigService: DigisellerConfigService,
	) {}

	@Query(() => DigisellerConfigPanelDto, { name: 'panelDigisellerConfig' })
	getConfig(): Promise<DigisellerConfigPanelDto> {
		return this.digisellerConfigService.getConfig();
	}

	@Query(() => [DigisellerRegionPanelDto], { name: 'panelDigisellerRegions' })
	getRegions(): Promise<DigisellerRegionPanelDto[]> {
		return this.digisellerConfigPanelService.getRegions();
	}

	@Mutation(() => OKDto, { name: 'panelDigisellerConfigUpdate' })
	updateConfig(
		@Args({
			name: 'args',
			type: () => DigisellerConfigUpdatePanelArgs,
		})
		args: DigisellerConfigUpdatePanelArgs,
	): Promise<OKDto> {
		return this.digisellerConfigPanelService.updateConfig(args);
	}
}
