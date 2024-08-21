import { Prisma } from '@prisma/client';

export const TelegramConfigSelectedFields = Prisma.validator<Prisma.TelegramConfigSelect>()({
	id: true,
	botToken: true,
	balanceChatId: true,
	balanceNotification: true,
	balanceThreshold: true,
	statusChangeChatId: true,
	statusChangeNotification: true,
	productPricesUpdatedChatId: true,
	productPricesUpdatedNotification: true,
});

export type TelegramConfigType = Prisma.TelegramConfigGetPayload<{
	select: typeof TelegramConfigSelectedFields;
}>;
