import { Module } from '@nestjs/common';

import { CustomInjectorService } from './custom-injector.service';

@Module({
	providers: [CustomInjectorService],
	exports: [CustomInjectorService],
})
export class CustomInjectorModule {}
