import { LangEnum, coreConfig } from '@libs/core/common';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import en from './assets/i18n/en/en.json';
import ru from './assets/i18n/ru/ru.json';

const resources = {
	[LangEnum.RU]: { translation: ru },
	[LangEnum.EN]: { translation: en },
};

i18n.use(Backend)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: coreConfig.defaultLang,
		debug: false,
		nonExplicitSupportedLngs: true,
		detection: {
			order: ['navigator'],
		},
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
