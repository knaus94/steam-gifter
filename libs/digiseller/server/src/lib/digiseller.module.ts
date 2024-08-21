import { DigisellerConfigPanelResolver } from '@libs/digiseller/server/lib/digiseller-panel/digiseller-panel-resolvers/digiseller-config-panel.resolver';
import { DigisellerConfigPanelService } from '@libs/digiseller/server/lib/digiseller-panel/digiseller-panel-services/digiseller-config-panel.service';
import { ProductModule } from '@libs/product/server';
import { ProxyModule } from '@libs/proxy/server';
import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { DynamicModule, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { DigisellerController } from './digiseller-controllers/digiseller.controller';
import { DigisellerPanelResolver } from './digiseller-panel/digiseller-panel-resolvers/digiseller-panel.resolver';
import { DigisellerPanelService } from './digiseller-panel/digiseller-panel-services/digiseller-panel.service';
import { DigisellerBootstrapService } from './digiseller-services/digiseller-bootstrap.service';
import { DigisellerConfigService } from './digiseller-services/digiseller-config.service';
import { DigisellerService } from './digiseller-services/digiseller.service';

@Module({
	imports: [SdkPrismaModule, ClsModule, ProxyModule],
	providers: [DigisellerService, DigisellerConfigService],
	exports: [SdkPrismaModule, ProxyModule, DigisellerConfigService, DigisellerService],
})
class DigisellerModuleCore {}

@Module({
	imports: [DigisellerModuleCore],
	exports: [DigisellerModuleCore],
})
export class DigisellerModule {
	static forRoot(): DynamicModule {
		return {
			module: DigisellerModule,
			imports: [ClsModule, ProductModule],
			providers: [
				DigisellerBootstrapService,
				DigisellerConfigPanelService,
				DigisellerConfigPanelResolver,
				DigisellerPanelService,
				DigisellerPanelResolver,
			],
			controllers: [DigisellerController],
		};
	}
}
