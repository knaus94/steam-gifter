import { CustomInjectorModule } from '@libs/custom-injector/server';
import { DynamicModule, Module } from '@nestjs/common';
import { SDK_PRISMA_CONFIG, SdkPrismaConfig } from './sdk-prisma.config';
import { SdkPrismaService } from './sdk-prisma.service';

@Module({
	imports: [CustomInjectorModule],
	providers: [SdkPrismaService],
	exports: [SdkPrismaService],
})
class SdkPrismaModuleCore {}

@Module({
	imports: [SdkPrismaModuleCore],
	exports: [SdkPrismaModuleCore],
})
export class SdkPrismaModule {
	static forRoot(config: SdkPrismaConfig): DynamicModule {
		return {
			module: SdkPrismaModule,
			providers: [{ provide: SDK_PRISMA_CONFIG, useValue: { ...config } }],
		};
	}
}
