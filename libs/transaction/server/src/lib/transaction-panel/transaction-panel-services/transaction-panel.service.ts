import { throwError, tuple } from '@libs/core/common';
import { OKDto, PaginationArgs } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { TransactionStatusLogSelectedFields } from '@libs/transaction/server';
import { TransactionPanelUpdateStatusArgs } from '@libs/transaction/server/lib/transaction-panel/transaction-panel-dto/transaction-panel-update-status.dto';
import { TransactionPanelArgs } from '@libs/transaction/server/lib/transaction-panel/transaction-panel-dto/transaction-panel.dto';
import { TransactionPanelSelectedFields } from '@libs/transaction/server/lib/transaction-panel/transaction-panel-types/transaction-panel.types';
import { TransactionHelpersService } from '@libs/transaction/server/lib/transaction-services/transaction-helpers.service';
import { Injectable } from '@nestjs/common';
import { BotStatusEnum, Prisma, TransactionStatusEnum } from '@prisma/client';

@Injectable()
export class TransactionPanelService {
	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly transactionHelpersService: TransactionHelpersService,
	) {}

	async getTransactions({ uniqCode, status, invoice, take, skip, sort, id }: TransactionPanelArgs) {
		const where: Prisma.TransactionWhereInput = {
			id: id
				? {
						equals: id,
				  }
				: undefined,
			paymentDetails:
				uniqCode || invoice
					? {
							uniqCode: uniqCode
								? {
										contains: uniqCode,
								  }
								: undefined,
							invoice: invoice
								? {
										equals: invoice,
								  }
								: undefined,
					  }
					: undefined,
			status,
		};

		return Promise.all([
			this.sdkPrismaService.transaction.findMany({
				where,
				skip,
				take,
				orderBy: {
					[Prisma.TransactionScalarFieldEnum[sort.field]]: sort.type,
				},
				select: {
					...TransactionPanelSelectedFields,
				},
			}),
			this.sdkPrismaService.transaction.count({
				where,
			}),
		]).then(([records, total]) => ({ records, total }));
	}

	async getTransaction(id: number) {
		return this.sdkPrismaService.transaction.findUnique({
			where: { id },
			select: {
				...TransactionPanelSelectedFields,
			},
		});
	}

	async getTransactionLogs(transactionId: number, { skip, take }: PaginationArgs) {
		const where: Prisma.TransactionStatusLogsWhereInput = {
			transaction: {
				id: transactionId,
			},
		};

		return Promise.all([
			this.sdkPrismaService.transactionStatusLogs.findMany({
				where,
				skip,
				take,
				orderBy: {
					id: 'desc',
				},
				select: {
					...TransactionStatusLogSelectedFields,
				},
			}),
			this.sdkPrismaService.transactionStatusLogs.count({
				where,
			}),
		]).then(([records, total]) => ({ records, total }));
	}

	async updateStatus(transactionId: number, args: TransactionPanelUpdateStatusArgs) {
		return this.transactionHelpersService.updateStatus({ transactionId, ...args, broadcast: true }).then(() => new OKDto());
	}

	async changeBot(transactionId: number, botId: number) {
		const transaction = await this.sdkPrismaService.transaction
			.findUniqueOrThrow({
				where: { id: transactionId },
				select: {
					botId: true,
					reservedSum: true,
					status: true,
				},
			})
			.catch(() => throwError(() => new Error('Transaction not found')));

		if (transaction.botId === botId) {
			throw new Error('Bot dublicated');
		}

		if (transaction.status === TransactionStatusEnum.SUCCESS) {
			throw new Error('Transaction already success');
		}

		const bot = await this.sdkPrismaService.bot
			.findUniqueOrThrow({
				where: { id: botId },
				select: {
					status: true,
					balance: true,
					reservedBalance: true,
				},
			})
			.catch(() => throwError(() => new Error('Bot not found')));

		if (bot.status !== BotStatusEnum.RUNNING) {
			throw new Error('Bot not running');
		}

		if (bot.balance - bot.reservedBalance < transaction.reservedSum) {
			throw new Error(`Bot balance is not enough. Current: ${bot.balance - bot.reservedBalance}, required: ${transaction.reservedSum}`);
		}

		const [updatedTransaction, error] = await tuple(
			this.sdkPrismaService.$transaction(async (prisma) => {
				const [updatedNewBot, updatedTransaction] = await Promise.all([
					prisma.bot.update({
						where: {
							id: botId,
						},
						data: {
							reservedBalance: {
								increment: transaction.reservedSum,
							},
						},
						select: {
							balance: true,
							reservedBalance: true,
						},
					}),
					prisma.transaction.update({
						where: {
							id: transactionId,
							status: transaction.status,
						},
						data: {
							botId,
						},
						select: {
							...TransactionPanelSelectedFields,
						},
					}),
				]);

				if (updatedNewBot.balance - updatedNewBot.reservedBalance < 0) {
					throw new Error();
				}

				if (transaction.botId) {
					await prisma.bot.update({
						where: {
							id: transaction.botId,
						},
						data: {
							reservedBalance: {
								decrement: transaction.reservedSum,
							},
						},
					});
				}

				return updatedTransaction;
			}),
		);

		if (error) {
			throw new Error('Не удалось обновить транзакцию');
		}

		return updatedTransaction;
	}

	async resetAttempts(transactionId: number) {
		return this.sdkPrismaService.transaction
			.update({
				where: {
					id: transactionId,
				},
				data: {
					sendAttempts: 3,
				},
			})
			.then(() => new OKDto())
			.catch(() => throwError(() => new Error('Transaction not found')));
	}

	async updateProfileLink(transactionId: number, profileLink: string) {
		return this.sdkPrismaService.transaction
			.update({
				where: {
					id: transactionId,
				},
				data: {
					profileLink,
				},
			})
			.then(() => new OKDto())
			.catch(() => throwError(() => new Error('Transaction not found')));
	}
}
