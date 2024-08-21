import { RegionCodeEnum } from '@prisma/client';
import { ECurrencyCode } from 'steam-user';

export enum CurrencyCodeEnum {
	ARS = 'ARS',
	EUR = 'EUR',
	KZT = 'KZT',
	RUB = 'RUB',
	TRY = 'TRY',
	UAH = 'UAH',
	USD = 'USD',
}

export const STEAM_USER_CURRENCY_REGION: Record<number, RegionCodeEnum> = {
	[ECurrencyCode[CurrencyCodeEnum.ARS]]: RegionCodeEnum.AR,
	[ECurrencyCode[CurrencyCodeEnum.EUR]]: RegionCodeEnum.EU,
	[ECurrencyCode[CurrencyCodeEnum.KZT]]: RegionCodeEnum.KZ,
	[ECurrencyCode[CurrencyCodeEnum.RUB]]: RegionCodeEnum.RU,
	[ECurrencyCode[CurrencyCodeEnum.TRY]]: RegionCodeEnum.TR,
	[ECurrencyCode[CurrencyCodeEnum.UAH]]: RegionCodeEnum.UA,
	[ECurrencyCode[CurrencyCodeEnum.USD]]: RegionCodeEnum.US,
};

export const CURRENCY_REGION: Record<CurrencyCodeEnum, RegionCodeEnum> = {
	[CurrencyCodeEnum.ARS]: RegionCodeEnum.AR,
	[CurrencyCodeEnum.EUR]: RegionCodeEnum.EU,
	[CurrencyCodeEnum.KZT]: RegionCodeEnum.KZ,
	[CurrencyCodeEnum.RUB]: RegionCodeEnum.RU,
	[CurrencyCodeEnum.TRY]: RegionCodeEnum.TR,
	[CurrencyCodeEnum.UAH]: RegionCodeEnum.UA,
	[CurrencyCodeEnum.USD]: RegionCodeEnum.US,
};

export const REGION_CURRENCY: Record<RegionCodeEnum, CurrencyCodeEnum> = {
	[RegionCodeEnum.AR]: CurrencyCodeEnum.ARS,
	[RegionCodeEnum.EU]: CurrencyCodeEnum.EUR,
	[RegionCodeEnum.KZ]: CurrencyCodeEnum.KZT,
	[RegionCodeEnum.RU]: CurrencyCodeEnum.RUB,
	[RegionCodeEnum.TR]: CurrencyCodeEnum.TRY,
	[RegionCodeEnum.UA]: CurrencyCodeEnum.UAH,
	[RegionCodeEnum.US]: CurrencyCodeEnum.USD,
};
