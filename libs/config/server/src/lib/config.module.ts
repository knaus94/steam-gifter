import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { DynamicModule, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ConfigPanelResolver } from './config-panel/config-panel-resolvers/config-panel.resolver';
import { ConfigPanelService } from './config-panel/config-panel-services/config-panel.service';
import { ConfigResolver } from './config-resolvers/config.resolver';
import { ConfigService } from './config-services/config.service';

@Module({
	imports: [SdkPrismaModule, ClsModule],
	providers: [ConfigService],
	exports: [SdkPrismaModule, ClsModule, ConfigService],
})
class ConfigModuleCore {}

@Module({
	imports: [ConfigModuleCore],
	exports: [ConfigModuleCore],
})
export class ConfigModule {
	static forRoot(): DynamicModule {
		return {
			module: ConfigModule,
			providers: [ConfigResolver, ConfigPanelResolver, ConfigPanelService],
		};
	}
}
