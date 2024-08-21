import { BotModule } from '@libs/bot/server';
import { CustomInjectorModule } from '@libs/custom-injector/server';
import { DigisellerModule } from '@libs/digiseller/server';
import { ProxyModule } from '@libs/proxy/server';
import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { TelegramModule } from '@libs/telegram/server';
import { DynamicModule, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ClsModule } from 'nestjs-cls';
import { TRANSACTION_CONFIG, TransactionConfig } from './transaction-configs/transaction.config';
import { TRANSACTION_REDIS_CONNECTION } from './transaction-constants/transaction.constants';
import { TransactionPanelResolver } from './transaction-panel/transaction-panel-resolvers/transaction-panel.resolver';
import { TransactionPanelService } from './transaction-panel/transaction-panel-services/transaction-panel.service';
import { TransactionResolver } from './transaction-resolvers/transaction.resolver';
import { TransactionBootstrapService } from './transaction-services/transaction-bootstrap.service';
import { TransactionEventsService } from './transaction-services/transaction-events.service';
import { TransactionHelpersService } from './transaction-services/transaction-helpers.service';
import { TransactionQueueService } from './transaction-services/transaction-queue.service';
import { TransactionService } from './transaction-services/transaction.service';

@Module({
	imports: [SdkPrismaModule, CustomInjectorModule, BotModule, DigisellerModule, ClsModule, ProxyModule, TelegramModule],
	providers: [TransactionService, TransactionEventsService, TransactionHelpersService, TransactionQueueService],
	exports: [
		SdkPrismaModule,
		CustomInjectorModule,
		TransactionService,
		TransactionEventsService,
		TransactionHelpersService,
		TransactionQueueService,
		BotModule,
	],
})
class TransactionsModuleCore {}

@Module({
	imports: [TransactionsModuleCore],
	exports: [TransactionsModuleCore],
})
export class TransactionsModule {
	static forRoot(config: TransactionConfig): DynamicModule {
		return {
			module: TransactionsModule,
			providers: [
				{ provide: TRANSACTION_CONFIG, useValue: { ...config } },
				{
					provide: TRANSACTION_REDIS_CONNECTION,
					useValue: new Redis(config.redis, { maxRetriesPerRequest: 0, autoResubscribe: true, lazyConnect: false }),
				},
				TransactionBootstrapService,
				TransactionResolver,
				TransactionPanelService,
				TransactionPanelResolver,
			],
		};
	}

	// static forFeature(): DynamicModule {
	//     return {
	//         module: TransactionsModule,
	//         exports: [TransactionEventsService],
	//     };
	// }
}
