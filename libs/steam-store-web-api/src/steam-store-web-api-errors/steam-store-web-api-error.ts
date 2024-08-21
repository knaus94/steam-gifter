import { STEAM_STORE_WEB_API_ERRORS_ENUM_TITLES, SteamStoreWebApiErrorsEnum } from './steam-store-web-api-errors.enum';

export class SteamStoreWebApiError extends Error {
	public code: SteamStoreWebApiErrorsEnum;

	constructor(code: SteamStoreWebApiErrorsEnum, customMessage?: string) {
		super(customMessage || STEAM_STORE_WEB_API_ERRORS_ENUM_TITLES[code]);

		this.code = code;
	}
}
