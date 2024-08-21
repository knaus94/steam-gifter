import { Prisma } from '@prisma/client';

export const BotSelectedFields = Prisma.validator<Prisma.BotSelect>()({
	id: true,
	steamId64: true,
	region: true,
	accountName: true,
	avatarUrl: true,
});

export type BotType = Prisma.BotGetPayload<{
	select: typeof BotSelectedFields;
}>;
