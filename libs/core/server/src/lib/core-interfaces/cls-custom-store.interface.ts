import { ClsStore } from 'nestjs-cls';
import { I18nContext } from 'nestjs-i18n';

export interface ClsCustomStore extends ClsStore {
	i18n: I18nContext;
	ipAddress: string;
	userAgent: string;
}
