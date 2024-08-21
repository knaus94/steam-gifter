import { CacheableModule } from '@knaus94/nestjs-cacheable';
import { AuthModule } from '@libs/auth/server';
import { BotModule } from '@libs/bot/server';
import { ConfigModule } from '@libs/config/server';
import { coreConfig } from '@libs/core/common';
import { CoreModule } from '@libs/core/server';
import { DigisellerModule } from '@libs/digiseller/server';
import { HealthModule } from '@libs/health/server';
import { ProductModule } from '@libs/product/server';
import { ProxyModule } from '@libs/proxy/server';
import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { createSlackDoneAttachments, createSlackErrorAttachments } from '@libs/slack/common';
import { SlackModule, SlackService } from '@libs/slack/server';
import { TelegramModule } from '@libs/telegram/server';
import { TransactionsModule } from '@libs/transaction/server';
import { UserModule } from '@libs/user/server';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { redisStore } from 'cache-manager-redis-yet';
import { IncomingMessage } from 'http';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { join } from 'path';

@Module({
	imports: [
		SlackModule.forRoot({
			serviceName: 'server',
			enable: Boolean(process.env.BRANCH_NAME),
			channel: process.env.BRANCH_NAME ? `#${process.env.BRANCH_NAME}` : '#localhost',
			domain: process.env.NX_PROJECT_DOMAIN!,
			tag: process.env.CRASH_TAG!,
			accessToken: process.env.SLACK_ACCESS_TOKEN!, // ref: https://thecodebarbarian.com/working-with-the-slack-api-in-node-js.html
		}),
		HealthModule.forRoot({
			enable: Boolean(process.env.PING_URL),
			pingUrl: process.env.PING_URL!,
		}),
		CoreModule.forRoot({
			production: coreConfig.isProd(),
			i18n: {
				defaultLang: coreConfig.defaultLang,
				loaderOptionsPath: join(__dirname, 'assets/i18n/'),
				typesOutputPath: join(process.cwd(), 'generated/server/i18n/types.ts'),
			},
			graphql: {
				autoSchemaFilePath: join(process.cwd(), 'generated/server/schema.gql'),
			},
		}),
		SdkPrismaModule.forRoot({
			datasources: { db: { url: process.env.POSTGRES_URL! } },
		}),
		ScheduleModule.forRoot(),
		CacheModule.register({
			store: redisStore,

			url: process.env.REDIS_URL!,
			ttl: 0,
			isGlobal: true,
		}),
		CacheableModule.register(),
		ThrottlerModule.forRoot({
			storage: new ThrottlerStorageRedisService(process.env.REDIS_URL!),
			throttlers: !coreConfig.isProd()
				? []
				: [
						{
							ttl: 1,
							limit: 3,
						},
						{
							name: 'medium',
							ttl: 10,
							limit: 20,
						},
						{
							name: 'long',
							ttl: 60,
							limit: 100,
						},
				  ],
		}),
		GoogleRecaptchaModule.forRoot({
			secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY!,
			response: (req: IncomingMessage) => (req.headers.recaptcha || '').toString(),
			skipIf: !coreConfig.isProd(),
			actions: ['PanelLogIn', 'Transaction', 'UpdateTransactionProfileLink', 'ResendTransaction'],
			score: parseFloat(process.env.GOOGLE_RECAPTCHA_SCORE ?? '0.5'),
		}),
		AuthModule.forRoot({
			jwtExpireMs: parseInt(process.env.JWT_EXPIRE_MS!, 10),
			jwtSecret: process.env.JWT_SECRET!,
		}),
		ConfigModule.forRoot(),
		UserModule.forRoot(),
		DigisellerModule.forRoot(),
		BotModule.forRoot({
			projectUrl: process.env.NX_PROJECT_URL!,
		}),
		ProxyModule.forRoot(),
		TransactionsModule.forRoot({
			redis: process.env.REDIS_URL!,
		}),
		TelegramModule.forRoot(),
		ProductModule.forRoot(),
	],
})
export class AppModule implements OnApplicationBootstrap, OnApplicationShutdown {
	private readonly logger = new Logger(AppModule.name);

	constructor(private readonly slackService: SlackService) {}

	onApplicationShutdown(signal: string) {
		this.logger.log('onApplicationShutdown');
		this.slackService.send({
			attachments: createSlackErrorAttachments(
				{ name: 'Application', message: `Shutdown with signal code "${signal}"` },
				{},
				{ application: 'server' },
			),
		});
	}
	onApplicationBootstrap() {
		this.logger.log('onApplicationBootstrap');
		this.slackService.send({
			attachments: createSlackDoneAttachments({ name: 'Application', message: 'Bootstrap' }, {}, { application: 'server' }),
		});
	}
}
