import { I18nPath } from '@generated/server/i18n/types';
import { DtoType, StringField } from '@libs/core/server';
import { Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { REGEX_PROFILE_LINK } from '../transaction-constants/transaction.constants';
import { TransactionArgs } from './transaction.dto';

@DtoType(TransactionUpdateProfileLinkArgs.name)
export class TransactionUpdateProfileLinkArgs extends TransactionArgs {
	@StringField()
	@Matches(REGEX_PROFILE_LINK, { message: i18nValidationMessage('errors.transaction.steam_link_not_valid' satisfies I18nPath) })
	profileLink: string;
}
