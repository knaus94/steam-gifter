import { LangEnum } from '@libs/core/common';
import { TransactionErrorsEnum } from '@libs/transaction/common';
import { GraphQLError } from 'graphql';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { TRANSACTION_ERRORS_ENUM_TITLES } from './transaction-errors-titles.enum';

export class TransactionError extends GraphQLError {
	constructor(
		code: TransactionErrorsEnum,
		i18n: I18nContext | I18nService,
		options: {
			lang?: LangEnum;
		} & Record<string, any> = {},
	) {
		super(i18n.t(TRANSACTION_ERRORS_ENUM_TITLES[code], options));
		this.extensions.code = code;
	}
}
