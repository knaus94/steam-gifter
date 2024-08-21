import { RegionCodeEnum } from '@prisma/client';

export const REGION_COURSES_TO_RUB_CONSTANTS: Record<RegionCodeEnum, number> = {
	[RegionCodeEnum.RU]: 1,
	[RegionCodeEnum.KZ]: 0.19,
	[RegionCodeEnum.AR]: 88.18,
	[RegionCodeEnum.EU]: 96.27,
	[RegionCodeEnum.US]: 88.18,
	[RegionCodeEnum.UA]: 2.44,
	[RegionCodeEnum.TR]: 88.18,
};
