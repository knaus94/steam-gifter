import { RegionCodeEnumType } from '@generated/client-panel/graphql/types';
import { Nullable } from '@libs/core/common';

export type GiftData = {
	name: string;
	productId: number;
	isDisabled: boolean;
	editionSelected: boolean;
	digisellerId: number;
	syncPrice: Nullable<boolean>;
	syncPricePercent: Nullable<number>;
	syncPriceRegion: Nullable<RegionCodeEnumType>;
	bots?: { regionId: number; botRegions: RegionCodeEnumType[] }[];
	editions: {
		bots: { regionId: number; botRegions: RegionCodeEnumType[] }[];
		name: Nullable<string>;
		productId: number;
		isDefault: Nullable<boolean>;
	}[];
};
