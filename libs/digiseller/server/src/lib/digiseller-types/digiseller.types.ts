import { Prisma } from '@prisma/client';

export const DigisellerProductSelectedFields = Prisma.validator<Prisma.DigisellerProductSelect>()({
	digisellerId: true,
	syncPricePercent: true,
	syncPriceRegion: true,
	editions: {
		where: {
			isDefault: true,
		},
		take: 1,
		select: {
			product: {
				select: {
					prices: true,
				},
			},
		},
	},
});

export type DigisellerProductType = Prisma.DigisellerProductGetPayload<{
	select: typeof DigisellerProductSelectedFields;
}>;
