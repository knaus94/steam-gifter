import { I18nPath } from '@generated/server/i18n/types';
import { ConfigErrorsEnum } from '@libs/config/common';

export const CONFIG_ERRORS_ENUM_TITLES: Record<ConfigErrorsEnum, I18nPath> = {
	[ConfigErrorsEnum.UnknownError]: 'errors.core.unknown_error',
	[ConfigErrorsEnum.NotFound]: 'errors.core.unknown_error',
};
