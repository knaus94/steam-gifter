import { AuthErrorsEnum } from '@libs/auth/common';
import { LangEnum } from '@libs/core/common';
import { GraphQLError } from 'graphql';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { AUTH_ERRORS_ENUM_TITLES } from './auth-errors-titles.enum';

export class AuthError extends GraphQLError {
	constructor(code: AuthErrorsEnum, i18n: I18nContext | I18nService, options: { lang?: LangEnum } & { args?: Record<string, any> } = {}) {
		super(i18n.t(AUTH_ERRORS_ENUM_TITLES[code], options));
		this.extensions.code = code;
	}
}
