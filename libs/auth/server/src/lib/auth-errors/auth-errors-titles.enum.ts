import { I18nPath } from '@generated/server/i18n/types';
import { AuthErrorsEnum } from '@libs/auth/common';

export const AUTH_ERRORS_ENUM_TITLES: Record<AuthErrorsEnum, I18nPath> = {
	[AuthErrorsEnum.Unauthorized]: 'errors.auth.unauthorized',
	[AuthErrorsEnum.AccessTokenExpired]: 'errors.auth.access_token_expired',
	[AuthErrorsEnum.Forbidden]: 'errors.auth.forbidden',
	[AuthErrorsEnum.LoginError]: 'errors.auth.login_error',
	[AuthErrorsEnum.TokenIsNotValid]: 'errors.auth.token_is_not_valid',
	[AuthErrorsEnum.SubscriptionExpired]: 'errors.auth.subscription_expired',
};
