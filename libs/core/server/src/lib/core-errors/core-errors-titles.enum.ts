import { I18nPath } from '@generated/server/i18n/types';
import { CoreErrorsEnum } from '@libs/core/common';

export const CORE_ERRORS_ENUM_TITLES: Record<CoreErrorsEnum, I18nPath> = {
	[CoreErrorsEnum.UnknownError]: 'errors.core.unknown_error',
	[CoreErrorsEnum.ValidationError]: 'errors.core.validation_error',
	[CoreErrorsEnum.RequestError]: 'errors.core.request_error',
	[CoreErrorsEnum.UnexpectedError]: 'errors.core.unexpected_error',
	[CoreErrorsEnum.Forbidden]: 'errors.core.forbidden',
	[CoreErrorsEnum.ForbiddenField]: 'errors.core.forbidden',
	[CoreErrorsEnum.TooManyRequests]: 'errors.core.too_many_requests',
	[CoreErrorsEnum.UnauthorizedError]: 'errors.core.unknown_error',
	[CoreErrorsEnum.RecaptchaValidationError]: 'errors.core.recaptcha_validation_error',
};
