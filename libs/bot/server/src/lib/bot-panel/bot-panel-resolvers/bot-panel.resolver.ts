import { CurrentUser, CurrentUserType } from '@libs/auth/server';
import { AuthGuard } from '@libs/auth/server/lib/auth-guards/auth.guard';
import { Nullable } from '@libs/core/common';
import { OKDto } from '@libs/core/server';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { BotStatusEventDto } from '../../bot-dto/bot-status-event.dto';
import { BotEventsService } from '../../bot-services/bot-events.service';
import {
	BotPanelArgs,
	BotPanelCreateArgs,
	BotPanelDto,
	BotPanelPaginatedDto,
	BotPanelParseInfoDto,
	BotPanelUpdateArgs,
} from '../bot-panel-dto/bot-panel.dto';
import { BotPanelHelpersService } from '../bot-panel-services/bot-panel-helpers.service';
import { BotPanelService } from '../bot-panel-services/bot-panel.service';

@Resolver()
@UseGuards(AuthGuard)
export class BotPanelResolver {
	constructor(
		private readonly botPanelService: BotPanelService,
		private readonly botPanelHelpersService: BotPanelHelpersService,
		private readonly botEventsService: BotEventsService,
	) {}

	@Query(() => BotPanelParseInfoDto, { name: 'panelParseBotInfo' })
	parseBotInfo(
		@Args({
			name: 'steamId64',
			type: () => String,
		})
		steamId64: string,
	): Promise<BotPanelParseInfoDto> {
		return this.botPanelService.parseBotInfo(steamId64);
	}

	@Query(() => BotPanelPaginatedDto, { name: 'panelBots' })
	getBots(
		@Args({
			name: 'args',
			type: () => BotPanelArgs,
		})
		args: BotPanelArgs,
	): Promise<BotPanelPaginatedDto> {
		return this.botPanelHelpersService.getBots(args);
	}

	@Query(() => BotPanelDto, { name: 'panelBot', nullable: true })
	getBot(
		@Args({
			name: 'id',
			type: () => Int,
		})
		id: number,
	): Promise<Nullable<BotPanelDto>> {
		return this.botPanelHelpersService.getBot(id);
	}

	@Mutation(() => BotPanelDto, { name: 'panelBotCreate' })
	createBot(
		@Args({
			name: 'args',
			type: () => BotPanelCreateArgs,
		})
		args: BotPanelCreateArgs,
	): Promise<BotPanelDto> {
		return this.botPanelService.createBot(args);
	}

	@Mutation(() => BotPanelDto, { name: 'panelBotUpdate' })
	updateBot(
		@Args({
			name: 'id',
			type: () => Int,
		})
		id: number,
		@Args({
			name: 'args',
			type: () => BotPanelUpdateArgs,
		})
		args: BotPanelUpdateArgs,
	): Promise<BotPanelDto> {
		return this.botPanelService.updateBot(id, args);
	}

	@Mutation(() => OKDto, { name: 'panelDeleteBot' })
	deleteBot(
		@Args({
			name: 'id',
			type: () => Int,
		})
		id: number,
	): Promise<OKDto> {
		return this.botPanelService.deleteBot(id);
	}

	@Query(() => Int, { name: 'panelCountBotsOnline' })
	getCountBotsOnline(@CurrentUser() currentUser: CurrentUserType): Promise<number> {
		return this.botPanelHelpersService.getCountBotsOnline();
	}

	@Subscription(() => BotStatusEventDto, {
		name: `Panel${BotEventsService.BotStatusStream}`,
		resolve: (payload: BotStatusEventDto) => {
			return payload;
		},
	})
	botStatusStream() {
		return this.botEventsService.asyncIteratorForBotStatusStream();
	}
}
