import { I18nPath } from '@generated/server/i18n/types';
import { TransactionErrorsEnum } from '@libs/transaction/common';

export const TRANSACTION_ERRORS_ENUM_TITLES: Record<TransactionErrorsEnum, I18nPath> = {
	[TransactionErrorsEnum.UnknownError]: 'errors.core.unknown_error',
	[TransactionErrorsEnum.TransactionGettingError]: 'errors.transaction.transaction_getting_error',
	[TransactionErrorsEnum.TransactionNotFound]: 'errors.transaction.transaction_not_found',
	[TransactionErrorsEnum.RegionFieldNotFound]: 'errors.transaction.region_field_not_found',
	[TransactionErrorsEnum.RegionInvalid]: 'errors.transaction.region_invalid',
	[TransactionErrorsEnum.SteamLinkFieldNotFound]: 'errors.transaction.steam_link_field_not_found',
	[TransactionErrorsEnum.AlreadyHaveTransaction]: 'errors.transaction.already_have_transaction',
	[TransactionErrorsEnum.ProductNotFound]: 'errors.transaction.product_not_found',
	[TransactionErrorsEnum.EditionFieldNotFound]: 'errors.transaction.edition_field_not_found',
	[TransactionErrorsEnum.EditionInvalid]: 'errors.transaction.edition_invalid',
	[TransactionErrorsEnum.InvoiceDuplicated]: 'errors.transaction.invoice_duplicated',
	[TransactionErrorsEnum.BotNotFound]: 'errors.transaction.bot_not_found',
	[TransactionErrorsEnum.TransactionResendLimit]: 'errors.transaction.transaction_resend_limit',
	[TransactionErrorsEnum.SteamLinkNotValid]: 'errors.transaction.steam_link_not_valid',
	[TransactionErrorsEnum.FriendRequestCooldown]: 'errors.transaction.friend_request_cooldown',
};
