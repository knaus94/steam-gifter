import { AuthGuard, CurrentUser, CurrentUserType } from '@libs/auth/server';
import { OKDto } from '@libs/core/server';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TelegramConfigService } from '../../telegram-services/telegram-config.service';
import { TelegramPanelConfigDto, TelegramPanelConfigUpdateArgs } from '../telegram-panel-dto/telegram-panel.dto';
import { TelegramPanelService } from '../telegram-panel-services/telegram-panel.service';

@Resolver()
@UseGuards(AuthGuard)
export class TelegramPanelResolver {
	constructor(
		private readonly telegramPanelService: TelegramPanelService,
		private readonly telegramConfigService: TelegramConfigService,
	) {}

	@Query(() => TelegramPanelConfigDto, { name: 'panelTelegramConfig' })
	getConfig(): Promise<TelegramPanelConfigDto> {
		return this.telegramConfigService.getConfig();
	}

	@Mutation(() => OKDto, { name: 'panelTelegramConfigUpdate' })
	updateConfig(
		@Args({
			name: 'args',
			type: () => TelegramPanelConfigUpdateArgs,
		})
		args: TelegramPanelConfigUpdateArgs,
	): Promise<OKDto> {
		return this.telegramPanelService.updateConfig(args);
	}
}
