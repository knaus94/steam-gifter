export enum SteamStoreWebApiErrorsEnum {
	SessionIdNotFound = 'SessionIdNotFound',
	CartIdNotFound = 'CartIdNotFound',
	NotLoggedIn = 'NotLoggedIn',
	HttpError = 'HttpError',
	NoResponseReceived = 'NoResponseReceived',
	UnknownError = 'UnknownError',
	CartIsEmpty = 'CartIsEmpty',
	InitTransactionFail = 'InitTransactionFail',
	UnknownTransid = 'UnknownTransid',
	FailedBuy = 'FailedBuy',
}

export const STEAM_STORE_WEB_API_ERRORS_ENUM_TITLES: Record<SteamStoreWebApiErrorsEnum, string> = {
	[SteamStoreWebApiErrorsEnum.SessionIdNotFound]: 'Session not found',
	[SteamStoreWebApiErrorsEnum.CartIdNotFound]: 'Cart id not found',
	[SteamStoreWebApiErrorsEnum.NotLoggedIn]: 'Not logged in',
	[SteamStoreWebApiErrorsEnum.HttpError]: 'Http error',
	[SteamStoreWebApiErrorsEnum.NoResponseReceived]: 'No response received',
	[SteamStoreWebApiErrorsEnum.UnknownError]: 'Unknown error',
	[SteamStoreWebApiErrorsEnum.CartIsEmpty]: 'CartIsEmpty',
	[SteamStoreWebApiErrorsEnum.InitTransactionFail]: 'Init transaction fail',
	[SteamStoreWebApiErrorsEnum.UnknownTransid]: 'Unknown Transid',
	[SteamStoreWebApiErrorsEnum.FailedBuy]: 'Failed buy',
};
