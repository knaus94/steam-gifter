import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { DynamicModule, Module } from '@nestjs/common';
import { UserPanelResolver } from './user-panel/user-panel-resolvers/user-panel.resolver';
import { UserPanelService } from './user-panel/user-panel-services/user-panel.service';
import { UserHelpersService } from './user-services/user-helpers.service';

@Module({
	imports: [SdkPrismaModule],
	providers: [UserHelpersService],
	exports: [SdkPrismaModule, UserHelpersService],
})
class UserModuleCore {}

@Module({
	imports: [UserModuleCore],
	exports: [UserModuleCore],
})
export class UserModule {
	static forRoot(): DynamicModule {
		return {
			module: UserModule,
			providers: [UserPanelService, UserPanelResolver],
		};
	}
}
