import { CoreErrorsEnum, LangEnum } from '@libs/core/common';
import { GraphQLError } from 'graphql';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CORE_ERRORS_ENUM_TITLES } from './core-errors-titles.enum';

export class CoreError extends GraphQLError {
	constructor(code: CoreErrorsEnum, i18n: I18nContext | I18nService, options: { lang?: LangEnum } & { args?: Record<string, any> } = {}) {
		super(i18n.t(CORE_ERRORS_ENUM_TITLES[code], options));
		this.extensions.code = code;
	}
}
