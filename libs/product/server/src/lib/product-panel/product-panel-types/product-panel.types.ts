import { Prisma } from '@prisma/client';

export const ProductPanelSelectedFields = Prisma.validator<Prisma.ProductSelect>()({
	id: true,
	name: true,
	identifier: true,
	isBundle: true,
	autoSync: true,
	prices: true,
});

export type ProductPanelType = Prisma.ProductGetPayload<{
	select: typeof ProductPanelSelectedFields;
}>;
