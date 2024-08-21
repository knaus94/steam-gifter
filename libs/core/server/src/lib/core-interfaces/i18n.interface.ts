import { I18nService } from 'nestjs-i18n';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface I18nServiceInterface extends I18nService {}

let globalI18nService: I18nServiceInterface;

export function setGlobalI18nService(i18nServiceInterface: I18nServiceInterface) {
	if (!globalI18nService) {
		globalI18nService = i18nServiceInterface;
	}
}

export function getGlobalI18nService() {
	return globalI18nService;
}
