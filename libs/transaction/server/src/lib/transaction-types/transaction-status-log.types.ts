import { Prisma } from '@prisma/client';

export const TransactionStatusLogTransactionSelectedFields = Prisma.validator<Prisma.TransactionSelect>()({
	id: true,
	paymentDetails: {
		select: {
			uniqCode: true,
		},
	},
});

export type TransactionStatusLogTransactionType = Prisma.TransactionGetPayload<{
	select: typeof TransactionStatusLogTransactionSelectedFields;
}>;

export const TransactionStatusLogSelectedFields = Prisma.validator<Prisma.TransactionStatusLogsSelect>()({
	id: true,
	transaction: {
		select: {
			...TransactionStatusLogTransactionSelectedFields,
		},
	},
	status: true,
	event: true,
	errMsg: true,
	createdAt: true,
});

export type TransactionStatusLogType = Prisma.TransactionStatusLogsGetPayload<{
	select: typeof TransactionStatusLogSelectedFields;
}>;
