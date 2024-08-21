import { ProductPanelSelectedFields } from '@libs/product/server/lib/product-panel/product-panel-types/product-panel.types';
import { Prisma } from '@prisma/client';
import { DigisellerRegionSelectedFields } from '../../digiseller-types/digiseller-config.types';

export const DigisellerProductEditionBotPanelSelectedFields = Prisma.validator<Prisma.DigisellerProductEditionBotsSelect>()({
	botRegions: true,
	region: {
		select: {
			...DigisellerRegionSelectedFields,
		},
	},
});

export type DigisellerProductEditionBotPanelType = Prisma.DigisellerProductEditionBotsGetPayload<{
	select: typeof DigisellerProductEditionBotPanelSelectedFields;
}>;

export const DigisellerProductEditionPanelSelectedFields = Prisma.validator<Prisma.DigisellerProductEditionSelect>()({
	id: true,
	name: true,
	product: {
		select: {
			...ProductPanelSelectedFields,
		},
	},
	bots: {
		select: {
			...DigisellerProductEditionBotPanelSelectedFields,
		},
	},
	isDefault: true,
});

export type DigisellerProductEditionPanelType = Prisma.DigisellerProductEditionGetPayload<{
	select: typeof DigisellerProductEditionPanelSelectedFields;
}>;

export const DigisellerProductPanelSelectedFields = Prisma.validator<Prisma.DigisellerProductSelect>()({
	id: true,
	isDisabled: true,
	digisellerId: true,
	editionSelection: true,
	name: true,
	previewUrl: true,
	editions: {
		where: {
			isDeleted: false,
		},
		select: {
			...DigisellerProductEditionPanelSelectedFields,
		},
	},
	syncPrice: true,
	syncPricePercent: true,
	syncPriceRegion: true,
	createdAt: true,
	updatedAt: true,
});

export type DigisellerProductPanelType = Prisma.DigisellerProductGetPayload<{
	select: typeof DigisellerProductPanelSelectedFields;
}>;
