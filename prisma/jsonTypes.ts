import { RegionCodeEnum } from '@prisma/client';
import { LangEnum } from '../libs/core/common/src';

declare global {
	namespace PrismaJson {
		type TranslationType = Partial<Record<LangEnum, string>>;
		type TransactionPurchaseInfoType = {
			assetId?: string;
			transactionId?: string;
		};
		type DigisellerProductRegion = {
			id: number;
			name: string;
		};
		type RegionPricesType = Partial<Record<RegionCodeEnum, number>>;
	}
}
