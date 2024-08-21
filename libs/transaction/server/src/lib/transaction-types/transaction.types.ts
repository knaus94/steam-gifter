import { BotSelectedFields } from '@libs/bot/server/lib/bot-types/bot.types';
import { Prisma } from '@prisma/client';
import { TransactionStatusLogSelectedFields } from './transaction-status-log.types';

export const TransactionPaymentDetailsSelectedFields = Prisma.validator<Prisma.TransactionPaymentDetailsSelect>()({
	invoice: true,
});

export type TransactionPaymentDetailsType = Prisma.TransactionPaymentDetailsGetPayload<{
	select: typeof TransactionPaymentDetailsSelectedFields;
}>;

export const TransactionEditionDigisellerProductSelectedFields = Prisma.validator<Prisma.DigisellerProductSelect>()({
	name: true,
	previewUrl: true,
});

export type TransactionEditionDigisellerProductType = Prisma.DigisellerProductGetPayload<{
	select: typeof TransactionEditionDigisellerProductSelectedFields;
}>;

export const TransactionEditionSelectedFields = Prisma.validator<Prisma.DigisellerProductEditionSelect>()({
	name: true,
	digisellerProduct: {
		select: {
			...TransactionEditionDigisellerProductSelectedFields,
		},
	},
});

export type TransactionEditionType = Prisma.DigisellerProductEditionGetPayload<{
	select: typeof TransactionEditionSelectedFields;
}>;

export const TransactionSelectedFields = Prisma.validator<Prisma.TransactionSelect>()({
	id: true,
	profileLink: true,
	bot: {
		select: {
			...BotSelectedFields,
		},
	},
	logs: {
		select: {
			...TransactionStatusLogSelectedFields,
		},
		orderBy: {
			id: 'desc',
		},
		distinct: 'status',
	},
	createdAt: true,
	updatedAt: true,
	status: true,
	paymentDetails: {
		select: {
			...TransactionPaymentDetailsSelectedFields,
		},
	},
	region: true,
	edition: {
		select: {
			...TransactionEditionSelectedFields,
		},
	},
});

export type TransactionType = Prisma.TransactionGetPayload<{
	select: typeof TransactionSelectedFields;
}>;
