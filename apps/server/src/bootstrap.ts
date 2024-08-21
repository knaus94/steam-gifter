import { coreConfig } from '@libs/core/common';
import { CoreLogger, CoreValidationExceptionFilter } from '@libs/core/server';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { readFileSync, writeFileSync } from 'fs';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import helmet from 'helmet';
import morgan from 'morgan';
import { I18nValidationPipe } from 'nestjs-i18n';
import passport from 'passport';
import { join } from 'path';
import { AppModule } from './app/app.module';

const logger = new Logger('Application:bootstrap');

(process.env.LOGGER_EXCLUDE_CONTEXTS! || '').split(',').forEach((contextName) => CoreLogger.addExcludeContexts(contextName));

/**
 * Helper to be used here & in tests.
 * @param app
 */
export const configureApp = (app: NestExpressApplication) => {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		integrations: [
			new Sentry.Integrations.Http({ tracing: true }),
			new Sentry.Integrations.Express({
				app: app.getHttpAdapter().getInstance(),
			}),
			...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
		],
		debug: false,

		tracesSampleRate: 1.0,
	});

	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());

	app.enableCors({
		// https://github.com/expressjs/cors#configuration-options
		origin: process.env.CORS_ORIGIN!,
		methods: 'POST,GET,PUT,OPTIONS,DELETE',
		allowedHeaders: 'Timezone-Offset,Origin,X-Requested-With,Content-Type,Accept,Authorization,Lang,Recaptcha',
	});

	app.use(graphqlUploadExpress({ maxFileSize: process.env.MAX_FILE_SIZE!, maxFiles: 1 }));

	//   If you are not going to use CSP at all, you can use this:
	app.use(
		helmet({
			crossOriginEmbedderPolicy: false,
			contentSecurityPolicy: false,
		}),
	);

	app.use(compression());

	app.useGlobalPipes(new I18nValidationPipe({ transform: true }));
	app.useGlobalFilters(new CoreValidationExceptionFilter());

	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);

	morgan.token('graphql-query', (req: any) => {
		const { query, variables, operationName } = req?.body || {};
		if (query && variables && operationName) {
			return `/${operationName} ${JSON.stringify(variables)} `;
		} else {
			return ' ';
		}
	});

	morgan.token('userId', (req: any) => {
		let userId = null;
		try {
			userId = req.user.id;
		} catch (error) {
			userId = null;
		}
		if (userId) {
			return `[userId: ${userId}] `;
		} else {
			return '';
		}
	});

	app.use(
		morgan(':method :url:graphql-query:userId:status :res[content-length] - :response-time ms', {
			// morgan(':method :url :status :res[content-length] - :response-time ms', {
			stream: {
				write: (message) => logger.log(message.replace('\n', '')),
			},
		}),
	);

	app.setBaseViewsDir(join(process.cwd(), 'views'));
	app.setViewEngine('hbs');

	const packageJson: {
		version: string;
		name: string;
		description: string;
	} = JSON.parse(readFileSync('./package.json').toString());

	const swaggerConfig = new DocumentBuilder()
		.setTitle(packageJson.name)
		.setDescription(packageJson.description)
		.setVersion(packageJson.version)
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);

	try {
		writeFileSync(join(process.cwd(), 'generated/server/swagger.json'), JSON.stringify(document, null, 4));
	} catch (err) {
		logger.error(err, err.stack);
	}

	if (!coreConfig.isProd())
		SwaggerModule.setup(globalPrefix, app, document, {
			swaggerOptions: {
				filter: true,
				ignoreGlobalPrefix: true,
			},
		});

	app.use(passport.initialize());
	app.use(cookieParser());
};

export async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: new CoreLogger(), cors: { origin: '*' } });
	configureApp(app);

	await app.listen(process.env.PORT || 5000);
}
