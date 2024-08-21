import { Prisma } from '@prisma/client';

export const TransactionPanelStatusLogSelectedFields = Prisma.validator<Prisma.TransactionStatusLogsSelect>()({
	id: true,
	status: true,
	event: true,
	errMsg: true,
	createdAt: true,
});

export type TransactionPanelStatusLogType = Prisma.TransactionStatusLogsGetPayload<{
	select: typeof TransactionPanelStatusLogSelectedFields;
}>;
