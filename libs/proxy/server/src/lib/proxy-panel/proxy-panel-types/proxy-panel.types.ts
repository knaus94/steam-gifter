import { Prisma } from '@prisma/client';

export const ProxyPanelSelectedFields = Prisma.validator<Prisma.ProxySelect>()({
	id: true,
	address: true,
	port: true,
	username: true,
	password: true,
	isValid: true,
});

export type ProxyPanelType = Prisma.ProxyGetPayload<{
	select: typeof ProxyPanelSelectedFields;
}>;
