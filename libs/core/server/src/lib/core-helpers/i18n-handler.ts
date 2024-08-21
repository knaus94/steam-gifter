import { coreConfig, LangEnum } from '@libs/core/common';
import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { requestHandlerFromCtx, requestHandlerFromHost } from './request-handler';

export const getClientLangFromCtx = (context: ExecutionContext) => {
	const { req } = requestHandlerFromCtx(context);
	return (LangEnum[I18nContext?.current(context)?.lang ?? req?.headers?.lang ?? req?.cookies?.['lang']] as LangEnum) ?? coreConfig.defaultLang;
};

export const getClientLangFromHost = (host: ArgumentsHost) => {
	const { req } = requestHandlerFromHost(host);
	return (LangEnum[I18nContext?.current(host)?.lang ?? req?.headers?.lang ?? req?.cookies?.['lang']] as LangEnum) ?? coreConfig.defaultLang;
};
