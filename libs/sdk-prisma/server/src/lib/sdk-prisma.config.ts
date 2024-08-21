import { Prisma } from '@prisma/client';

export const SDK_PRISMA_CONFIG = 'SDK_PRISMA_CONFIG';

export interface SdkPrismaConfig {
	datasources: Prisma.Datasources;
}
