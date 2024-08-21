import { SlackModule } from '@libs/slack/server';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Logger, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { getClientIp } from '@supercharge/request-ip';
import { ClsModule } from 'nestjs-cls';
import {
	AcceptLanguageResolver,
	CookieResolver,
	GraphQLWebsocketResolver,
	HeaderResolver,
	I18nContext,
	I18nModule,
	QueryResolver,
} from 'nestjs-i18n';
import { CORE_CONFIG, CoreConfig } from './core-configs/core.config';
import { CoreErrorsFilter } from './core-filters/core-exception.filter';
import { getGraphQLBasicOptions } from './core-graphql/core-graphql-basic-options';
import { ThrottlerGuard } from './core-guards/core-throttler.guard';
import { requestHandlerFromCtx } from './core-helpers/request-handler';
import { ClsCustomStore } from './core-interfaces/cls-custom-store.interface';
import { getGlobalI18nService } from './core-interfaces/i18n.interface';
import { CoreBootstrapService } from './core-services/core-bootstrap.service';

@Module({})
export class CoreModule {
	static forRoot(coreConfig: CoreConfig): DynamicModule {
		return {
			module: CoreModule,
			imports: [
				GraphQLModule.forRoot<ApolloDriverConfig>(
					getGraphQLBasicOptions(new Logger(GraphQLModule.name, { timestamp: true }), coreConfig),
				),
				I18nModule.forRoot({
					fallbackLanguage: coreConfig.i18n.defaultLang,
					loaderOptions: {
						path: coreConfig.i18n.loaderOptionsPath,
						watch: !coreConfig.production,
					},
					typesOutputPath: coreConfig.production ? undefined : coreConfig.i18n.typesOutputPath,
					resolvers: [
						GraphQLWebsocketResolver,
						new QueryResolver(['lang']),
						new HeaderResolver(['lang']),
						new CookieResolver(['lang']),
						AcceptLanguageResolver,
					],
					logging: !coreConfig.production,
				}),
				ClsModule.forRoot({
					interceptor: {
						mount: true,
						setup: (cls, context) => {
							const i18n = I18nContext.current(context);
							const { req } = requestHandlerFromCtx(context);
							cls.set<ClsCustomStore>('i18n', !i18n?.service ? getGlobalI18nService() : i18n);
							cls.set<ClsCustomStore>('ipAddress', getClientIp(req));
							cls.set<ClsCustomStore>('userAgent', req.headers['user-agent']);
						},
					},
				}),
				SlackModule,
			],
			providers: [
				CoreBootstrapService,
				{ provide: APP_FILTER, useClass: CoreErrorsFilter },
				{
					provide: APP_GUARD,
					useClass: ThrottlerGuard,
				},
				{ provide: CORE_CONFIG, useValue: { ...coreConfig } },
			],
		};
	}
}
