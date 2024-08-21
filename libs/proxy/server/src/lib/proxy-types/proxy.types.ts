import { Prisma } from '@prisma/client';

export const ProxySelectedFields = Prisma.validator<Prisma.ProxySelect>()({
	id: true,
	address: true,
	port: true,
	username: true,
	password: true,
	isValid: true,
});

export type ProxyType = Prisma.ProxyGetPayload<{
	select: typeof ProxySelectedFields;
}>;
