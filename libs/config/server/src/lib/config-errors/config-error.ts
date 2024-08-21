import { ConfigErrorsEnum } from '@libs/config/common';
import { LangEnum } from '@libs/core/common';
import { GraphQLError } from 'graphql';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CONFIG_ERRORS_ENUM_TITLES } from './config-errors-titles.enum';

export class ConfigError extends GraphQLError {
	constructor(
		code: ConfigErrorsEnum,
		i18n: I18nContext | I18nService,
		options: {
			lang?: LangEnum;
		} & Record<string, any> = {},
	) {
		super(i18n.t(CONFIG_ERRORS_ENUM_TITLES[code], options));
		this.extensions.code = code;
	}
}
