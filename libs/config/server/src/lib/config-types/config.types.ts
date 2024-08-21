import { Prisma } from '@prisma/client';

export const ConfigSelectedFields = Prisma.validator<Prisma.ConfigSelect>()({
	id: true,
	skypeLink: true,
	supportLink: true,
	telegramLogin: true,
	vkLink: true,
	email: true,
	discordLink: true,
});

export type ConfigType = Prisma.ConfigGetPayload<{
	select: typeof ConfigSelectedFields;
}>;
