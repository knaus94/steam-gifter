import { CustomInjectorModule } from '@libs/custom-injector/server';
import { ProxyModule } from '@libs/proxy/server';
import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { DynamicModule, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { BOT_CONFIG, BotConfig } from './bot-configs/bot.config';
import { BotPanelOperationResolver } from './bot-panel/bot-panel-resolvers/bot-panel-operation.resolver';
import { BotPanelResolver } from './bot-panel/bot-panel-resolvers/bot-panel.resolver';
import { BotPanelHelpersService } from './bot-panel/bot-panel-services/bot-panel-helpers.service';
import { BotPanelOperationService } from './bot-panel/bot-panel-services/bot-panel-operation.service';
import { BotPanelService } from './bot-panel/bot-panel-services/bot-panel.service';
import { BotBootstrapService } from './bot-services/bot-bootstrap.service';
import { BotEventsService } from './bot-services/bot-events.service';
import { BotHelpersService } from './bot-services/bot-helpers.service';
import { BotService } from './bot-services/bot.service';

@Module({
	imports: [CustomInjectorModule, SdkPrismaModule, ClsModule, ProxyModule],
	providers: [BotService, BotEventsService, BotHelpersService, BotPanelHelpersService],
	exports: [
		CustomInjectorModule,
		SdkPrismaModule,
		ClsModule,
		BotService,
		BotEventsService,
		BotHelpersService,
		BotPanelHelpersService,
		ProxyModule,
	],
})
class BotModuleCore {}

@Module({
	imports: [BotModuleCore],
	exports: [BotModuleCore],
})
export class BotModule {
	static forRoot(config: BotConfig): DynamicModule {
		return {
			module: BotModule,
			imports: [],
			providers: [
				{
					provide: BOT_CONFIG,
					useValue: { ...config },
				},
				BotBootstrapService,
				BotPanelService,
				BotPanelOperationService,
				BotPanelResolver,
				BotPanelOperationResolver,
			],
		};
	}
}
