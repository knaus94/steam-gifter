import { BotModule } from '@libs/bot/server';
import { ProductModule } from '@libs/product/server';
import { ProxyModule } from '@libs/proxy/server';
import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { DynamicModule, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { TelegramPanelResolver } from './telegram-panel/telegram-panel-resolvers/telegram-panel.resolver';
import { TelegramPanelService } from './telegram-panel/telegram-panel-services/telegram-panel.service';
import { TelegramBootstrapService } from './telegram-services/telegram-bootstrap.service';
import { TelegramConfigService } from './telegram-services/telegram-config.service';
import { TelegramService } from './telegram-services/telegram.service';

@Module({
	imports: [SdkPrismaModule, ClsModule, ProxyModule],
	providers: [TelegramConfigService, TelegramService],
	exports: [SdkPrismaModule, TelegramConfigService, TelegramService],
})
class TelegramModuleCore {}

@Module({
	imports: [TelegramModuleCore],
	exports: [TelegramModuleCore],
})
export class TelegramModule {
	static forRoot(): DynamicModule {
		return {
			module: TelegramModule,
			imports: [BotModule, ProductModule],
			providers: [TelegramBootstrapService, TelegramPanelResolver, TelegramPanelService],
		};
	}
}
