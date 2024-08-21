import { CustomInjectorModule } from '@libs/custom-injector/server';
import { DynamicModule, Module } from '@nestjs/common';
import { HEALTH_CONFIG, HealthConfig } from './health-config/health.config';
import { HealthBootstrapService } from './health-services/health-bootstrap.service';

@Module({
	imports: [CustomInjectorModule],
	exports: [CustomInjectorModule],
})
class HealthModuleCore {}

@Module({
	imports: [HealthModuleCore],
	exports: [HealthModuleCore],
})
export class HealthModule {
	static forRoot(config: HealthConfig): DynamicModule {
		return {
			module: HealthModule,
			providers: [HealthBootstrapService, { provide: HEALTH_CONFIG, useValue: { ...config } }],
		};
	}
}
