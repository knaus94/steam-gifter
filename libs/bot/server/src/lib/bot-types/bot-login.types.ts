import { Prisma } from '@prisma/client';

export const BotLoginSelectedFields = Prisma.validator<Prisma.BotSelect>()({
	id: true,
	login: true,
	steamId64: true,
	sharedSecret: true,
	password: true,
	avatarUrl: true,
	accountName: true,
	region: true,
	proxy: {
		select: {
			id: true,
			address: true,
			port: true,
			username: true,
			password: true,
			isValid: true,
		},
	},
});

export type BotLoginType = Prisma.BotGetPayload<{
	select: typeof BotLoginSelectedFields;
}>;
