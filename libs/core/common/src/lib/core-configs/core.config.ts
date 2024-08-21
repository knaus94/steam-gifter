import { LangEnum } from '../core-enums/langs.enum';

export const coreConfig = {
	isDev,
	isProd,
	isTest,
	defaultLang: LangEnum.RU,
	project: {
		url: `${process.env.NX_PROJECT_PROTOCOL!}://${process.env.NX_PROJECT_DOMAIN!}`,
		apiUrl: `${process.env.NX_PROJECT_PROTOCOL!}://${process.env.NX_PROJECT_DOMAIN!}/api`,
		graphqlUrl: `${process.env.NX_PROJECT_PROTOCOL!}://${process.env.NX_PROJECT_DOMAIN!}/graphql`,
		graphqlSubUrl: `${process.env.NX_PROJECT_PROTOCOL! === 'https' ? 'wss' : 'ws'}://${process.env.NX_PROJECT_DOMAIN!}/graphql`,
	},
};

function isDev() {
	return process.env.NODE_ENV === 'development';
}

function isProd() {
	return process.env.NODE_ENV === 'production';
}

function isTest() {
	return process.env.NODE_ENV === 'test';
}
