import { BotEventsService, BotService } from '@libs/bot/server';
import { CustomInjectorService } from '@libs/custom-injector/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { BotStatusEnum, TransactionEventEnum, TransactionStatusEnum } from '@prisma/client';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { EFriendRelationship } from 'steam-user';
import { TRANSACTION_CONFIG, TransactionConfig } from '../transaction-configs/transaction.config';
import { TRANSACTION_REDIS_CONNECTION } from '../transaction-constants/transaction.constants';
import { TransactionHelpersService } from './transaction-helpers.service';
import { TransactionService } from './transaction.service';

@Injectable()
export class TransactionQueueService implements OnApplicationBootstrap {
	private readonly logger = new Logger(TransactionQueueService.name);
	private readonly botsMap = new Map<number, [Queue<number>, Worker]>();

	constructor(
		private readonly transactionService: TransactionService,
		private readonly customInjectorService: CustomInjectorService,
		private readonly botEventsService: BotEventsService,
		private readonly botService: BotService,
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly transactionHelpersService: TransactionHelpersService,
	) {}

	private get config() {
		return this.customInjectorService.getLastComponentByName<TransactionConfig>(TRANSACTION_CONFIG)!;
	}

	private get redisConnection() {
		return this.customInjectorService.getLastComponentByName<Redis>(TRANSACTION_REDIS_CONNECTION)!;
	}

	onApplicationBootstrap() {
		this.logger.log('onApplicationBootstrap');

		this.subscribeToListenBotFriendRelationshipStream();
		this.subscribeToListenBotStatusStream();
	}

	async addTransactionToQueue(botId: number, transactionId: number) {
		if (this.botService.getBotInService(botId)) {
			let [queue, worker] = this.botsMap.get(botId) || [];

			if (!queue) {
				queue = new Queue<number>(botId.toString(), {
					connection: this.redisConnection,
				});

				worker = new Worker<number>(
					botId.toString(),
					async (job) => await this.transactionService.processTransaction(job.data).then((isSuccess) => isSuccess ?? false),
					{
						connection: this.redisConnection,
						limiter: {
							max: 1,
							duration: 4 * 60 * 1000,
						},
						removeOnComplete: {
							age: 0,
							count: 0,
						},
						removeOnFail: {
							age: 0,
							count: 0,
						},
						autorun: true,
					},
				);

				this.botsMap.set(botId, [queue, worker]);
			}

			queue.add(TransactionService.name, transactionId);
		}
	}

	private async deleteQueue(botId: number) {
		if (this.botsMap.has(botId)) {
			const [queue, worker] = this.botsMap.get(botId)!;

			await Promise.all([queue.removeAllListeners().close(), worker.removeAllListeners().close(true)]);
			this.botsMap.delete(botId);
		}
	}

	/**
	 * Подписка на мониторинг друзей
	 * Кидает транзакцию в очередь, если находит транзакцию в статусе `FRIEND_REQUEST_SENT`
	 */
	private subscribeToListenBotFriendRelationshipStream() {
		this.logger.debug('subscribeToListenBotFriendRelationshipStream');
		this.botEventsService.listenBotFriendRelationshipStream().subscribe(async ({ bot, steamId64, relationship }) => {
			const transaction = await this.sdkPrismaService.transaction.findFirst({
				where: {
					steamId64,
					botId: bot.id,
					status: TransactionStatusEnum.FRIEND_REQUEST_SENT,
				},
			});

			if (!transaction) {
				return;
			}

			switch (relationship) {
				case EFriendRelationship.Friend:
					await this.transactionHelpersService
						.updateStatus({
							transactionId: transaction.id,
							currentStatus: TransactionStatusEnum.FRIEND_REQUEST_SENT,
							newStatus: TransactionStatusEnum.PROCESS,
							broadcast: true,
						})
						.then(() => this.addTransactionToQueue(bot.id, transaction.id))
						.catch((e) => this.logger.error(e));
					break;

				case EFriendRelationship.None:
					await this.transactionHelpersService
						.updateStatus({
							transactionId: transaction.id,
							currentStatus: TransactionStatusEnum.FRIEND_REQUEST_SENT,
							newStatus: TransactionStatusEnum.ERROR,
							event: TransactionEventEnum.FRIEND_REQUEST_CANCELED,
							broadcast: true,
						})
						.catch((e) => this.logger.error(e));
					break;
			}
		});
	}

	/**
	 * Если бот уходит в офф, ищем транзакции которые были в процессе - меняем на ошибку.
	 * Транзакции которым был отправлен гифт - закрываем.
	 * Удаляем очередь дабы освободить коннект в редис
	 *
	 * Если бот запустился, получаем транзакции которые были в процессе и кидаем их в очередь
	 */
	private subscribeToListenBotStatusStream() {
		this.logger.debug('subscribeToListenBotStatusStream');
		this.botEventsService.listenBotStatusStream().subscribe(async ({ bot, newStatus }) => {
			if (newStatus === BotStatusEnum.STOPPED || newStatus === BotStatusEnum.ERROR) {
				const [transactions] = await Promise.all([
					this.sdkPrismaService.transaction.findMany({
						where: {
							botId: bot.id,
							status: {
								notIn: [TransactionStatusEnum.ERROR, TransactionStatusEnum.SUCCESS],
							},
						},
						select: {
							id: true,
							status: true,
						},
					}),
					this.deleteQueue(bot.id),
				]);

				for (const { id, status: oldStatus } of transactions) {
					const [newStatus, event] = (() => {
						switch (oldStatus) {
							case TransactionStatusEnum.SENT_GIFT:
								return [TransactionStatusEnum.SUCCESS, TransactionEventEnum.BOT_IS_OFFLINE];

							default:
								return [TransactionStatusEnum.ERROR, TransactionEventEnum.BOT_IS_OFFLINE];
						}
					})();

					await this.transactionHelpersService.updateStatus({
						transactionId: id,
						newStatus,
						event,
						broadcast: true,
					});
				}
			} else if (newStatus === BotStatusEnum.RUNNING) {
				const transactions = await this.sdkPrismaService.transaction.findMany({
					where: {
						botId: bot.id,
						status: TransactionStatusEnum.PROCESS,
					},
				});

				for (const { botId, id: transactionId } of transactions) {
					await this.addTransactionToQueue(botId!, transactionId);
				}
			}
		});
	}
}
