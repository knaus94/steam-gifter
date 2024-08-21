import { CustomInjectorService } from '@libs/custom-injector/server';
import { INestApplication, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import '@prisma/jsonTypes';
import { captureException } from '@sentry/node';
import { SDK_PRISMA_CONFIG, SdkPrismaConfig } from './sdk-prisma.config';

@Injectable()
export class SdkPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private logger = new Logger(SdkPrismaService.name);

	constructor(private readonly customInjectorService: CustomInjectorService) {
		super({
			datasources: customInjectorService.getLastComponentByName<SdkPrismaConfig>(SDK_PRISMA_CONFIG)!.datasources,
			log: [
				{
					emit: 'event',
					level: 'error',
				},
			],
		});
	}

	async onModuleInit(): Promise<void> {
		this.logger.log('onModuleInit');
		try {
			(this as any).$on('query', (e) => {
				if (e.query !== 'SELECT 1') {
					this.logger.log(`query: ${e.query}, params: ${e.params}, duration: ${e.duration}`);
				}
			});
			(this as any).$on('error', (e) => {
				// this.logger.error(`target: ${e.target}, message: ${e.message}`);
				if (
					String(e.message).includes('57P01') ||
					String(e.message).includes('Timed out fetching a new connection from the connection pool')
				) {
					captureException(e);

					process.exit(1);
				}
			});

			await this.$connect();
			setInterval(() => this.$executeRaw`SELECT 1;`.catch((err) => this.logger.error(err, err.stack)), 5 * 60000);
		} catch (err) {
			this.logger.error(err.message, err.stack);
		}
	}

	async onModuleDestroy(): Promise<void> {
		this.logger.log('onModuleDestroy');
		await this.$disconnect();
	}

	async enableShutdownHooks(app: INestApplication) {
		process.on('beforeExit', async () => {
			await app.close();
		});
	}
}
