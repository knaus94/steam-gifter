import { ProxyModule } from '@libs/proxy/server';
import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { SlackModule } from '@libs/slack/server';
import { DynamicModule, Module } from '@nestjs/common';
import { ProductPanelResolver } from './product-panel/product-panel-resolvers/product-panel.resolver';
import { ProductPanelService } from './product-panel/product-panel-services/product-panel.service';
import { ProductPriceUpdaterBootstrapService } from './product-updater/product-updater-services/product-updater-bootstrap.service';
import { ProductUpdaterEventsService } from './product-updater/product-updater-services/product-updater-events.service';
import { ProductUpdaterHelpersService } from './product-updater/product-updater-services/product-updater-helpers.service';
import { ProductUpdaterService } from './product-updater/product-updater-services/product-updater.service';

@Module({
	imports: [SdkPrismaModule],
	providers: [ProductUpdaterHelpersService, ProductUpdaterEventsService],
	exports: [SdkPrismaModule, ProductUpdaterHelpersService, ProductUpdaterEventsService],
})
class ProductModuleCore {}

@Module({
	imports: [ProductModuleCore],
	exports: [ProductModuleCore],
})
export class ProductModule {
	static forRoot(): DynamicModule {
		return {
			module: ProductModule,
			imports: [ProxyModule, SlackModule],
			providers: [ProductPanelService, ProductPanelResolver, ProductPriceUpdaterBootstrapService, ProductUpdaterService],
		};
	}
}
