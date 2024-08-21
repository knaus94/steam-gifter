import { CurrentUser, CurrentUserType } from '@libs/auth/server';
import { AuthGuard } from '@libs/auth/server/lib/auth-guards/auth.guard';
import { OKDto } from '@libs/core/server';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { Observable } from 'rxjs';
import { BotPanelOperationService } from '../bot-panel-services/bot-panel-operation.service';

@Resolver()
@UseGuards(AuthGuard)
export class BotPanelOperationResolver {
	constructor(private readonly botPanelOperationService: BotPanelOperationService) {}

	@Throttle({ default: { limit: 1, ttl: 0.5 } })
	@Mutation(() => OKDto, { name: 'panelBotStart' })
	tartBot(@Args('botId', { type: () => Int }) botId: number): Observable<OKDto> {
		return this.botPanelOperationService.startBot(botId);
	}

	@Throttle({ default: { limit: 1, ttl: 0.5 } })
	@Mutation(() => OKDto, { name: 'panelBotStop' })
	stopBot(@Args('botId', { type: () => Int }) botId: number): Observable<OKDto> {
		return this.botPanelOperationService.stopBot(botId);
	}

	@Throttle({ default: { limit: 1, ttl: 0.5 } })
	@Mutation(() => OKDto, { name: 'panelBotRestart' })
	restartBot(@Args('botId', { type: () => Int }) botId: number): Observable<OKDto> {
		return this.botPanelOperationService.restartBot(botId);
	}

	@Throttle({ default: { limit: 1, ttl: 5 } })
	@Mutation(() => OKDto, { name: 'panelStopAllBots' })
	stopAllBots(): Observable<OKDto> {
		return this.botPanelOperationService.stopAllBots();
	}

	@Throttle({ default: { limit: 1, ttl: 5 } })
	@Mutation(() => OKDto, { name: 'panelStartAllBots' })
	startAllBots(): Observable<OKDto> {
		return this.botPanelOperationService.startAllBots();
	}

	@Throttle({ default: { limit: 1, ttl: 5 } })
	@Mutation(() => OKDto, { name: 'panelRestartAllBots' })
	restartAllBots(): Observable<OKDto> {
		return this.botPanelOperationService.restartAllBots();
	}
}
