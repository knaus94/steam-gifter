import { CustomInjectorModule } from '@libs/custom-injector/server';
import { DynamicModule, Module } from '@nestjs/common';
import { SLACK_CONFIG, SlackConfig } from './slack-config/slack.config';
import { SlackService } from './slack-services/slack.service';

@Module({
	imports: [CustomInjectorModule],
	providers: [SlackService],
	exports: [CustomInjectorModule, SlackService],
})
class SlackModuleCore {}

@Module({
	imports: [SlackModuleCore],
	exports: [SlackModuleCore],
})
export class SlackModule {
	static forRoot(config: SlackConfig): DynamicModule {
		return {
			module: SlackModule,
			providers: [{ provide: SLACK_CONFIG, useValue: { enable: true, ...config } }],
		};
	}
}
