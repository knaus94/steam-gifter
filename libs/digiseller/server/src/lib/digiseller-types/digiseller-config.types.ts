import { Prisma } from '@prisma/client';

export const DigisellerRegionSelectedFields = Prisma.validator<Prisma.DigisellerRegionSelect>()({
	id: true,
	name: true,
});

export type DigisellerRegionType = Prisma.DigisellerRegionGetPayload<{
	select: typeof DigisellerRegionSelectedFields;
}>;

export const DigisellerConfigSelectedFields = Prisma.validator<Prisma.DigisellerConfigSelect>()({
	id: true,
	profileLinkFieldName: true,
	regionFieldName: true,
	editionSelectionFieldName: true,
	token: true,
	sellerId: true,
	apiKey: true,
	tokenUpdatedAt: true,
	regions: {
		select: {
			...DigisellerRegionSelectedFields,
		},
	},
});

export type DigisellerConfigType = Prisma.DigisellerConfigGetPayload<{
	select: typeof DigisellerConfigSelectedFields;
}>;
