import { LangEnum } from '@libs/core/common';

export const CORE_CONFIG = 'CORE_CONFIG';

export interface CoreConfig {
	production: boolean;
	i18n: {
		defaultLang: LangEnum;
		typesOutputPath: string;
		loaderOptionsPath: string;
	};
	graphql: {
		autoSchemaFilePath: string;
	};
}
