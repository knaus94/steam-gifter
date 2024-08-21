import { BotPanelSelectedFields } from '@libs/bot/server';
import { DigisellerProductEditionPanelSelectedFields } from '@libs/digiseller/server';
import { Prisma } from '@prisma/client';

export const TransactionPanelPaymentDetailsSelectedFields = Prisma.validator<Prisma.TransactionPaymentDetailsSelect>()({
	uniqCode: true,
	invoice: true,
});

export type TransactionPanelPaymentDetailsType = Prisma.TransactionPaymentDetailsGetPayload<{
	select: typeof TransactionPanelPaymentDetailsSelectedFields;
}>;

export const TransactionPanelSelectedFields = Prisma.validator<Prisma.TransactionSelect>()({
	id: true,
	paymentDetails: {
		select: {
			...TransactionPanelPaymentDetailsSelectedFields,
		},
	},
	profileLink: true,
	steamId64: true,
	bot: {
		select: {
			...BotPanelSelectedFields,
		},
	},
	createdAt: true,
	updatedAt: true,
	status: true,
	region: true,
	sendAttempts: true,
	edition: {
		select: {
			...DigisellerProductEditionPanelSelectedFields,
		},
	},
});

export type TransactionPanelType = Prisma.TransactionGetPayload<{
	select: typeof TransactionPanelSelectedFields;
}>;
