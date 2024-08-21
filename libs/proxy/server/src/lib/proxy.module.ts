import { BotModule } from '@libs/bot/server';
import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { SlackModule } from '@libs/slack/server';
import { DynamicModule, Module } from '@nestjs/common';
import { ProxyPanelResolver } from './proxy-panel/proxy-panel-resolvers/proxy-panel.resolver';
import { ProxyPanelBootstrapService } from './proxy-panel/proxy-panel-services/proxy-panel-bootstrap.service';
import { ProxyPanelHelpersService } from './proxy-panel/proxy-panel-services/proxy-panel-helpers.service';
import { ProxyPanelService } from './proxy-panel/proxy-panel-services/proxy-panel.service';
import { ProxyHelpersService } from './proxy-services/proxy-helpers.service';

@Module({
	imports: [SdkPrismaModule],
	providers: [ProxyHelpersService],
	exports: [SdkPrismaModule, ProxyHelpersService],
})
class ProxyModuleCore {}

@Module({
	imports: [ProxyModuleCore],
	exports: [ProxyModuleCore],
})
export class ProxyModule {
	static forRoot(): DynamicModule {
		return {
			module: ProxyModule,
			imports: [BotModule, SlackModule],
			providers: [ProxyPanelHelpersService, ProxyPanelService, ProxyPanelResolver, ProxyPanelBootstrapService],
		};
	}
}
