import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { I18nValidationError, I18nValidationException, I18nValidationExceptionFilter } from 'nestjs-i18n';

import { CoreErrorsEnum } from '@libs/core/common';
import { captureException } from '@sentry/node';
import { GraphQLError } from 'graphql';
import { CORE_ERRORS_ENUM_TITLES } from '../core-errors/core-errors-titles.enum';
import { formatI18nErrors } from '../core-helpers/i18n-error-format';
import { getClientLangFromHost } from '../core-helpers/i18n-handler';
import { requestHandlerFromHost } from '../core-helpers/request-handler';
import { getGlobalI18nService } from '../core-interfaces/i18n.interface';

@Catch(I18nValidationException)
export class CoreValidationExceptionFilter extends I18nValidationExceptionFilter {
	private logger = new Logger(CoreValidationExceptionFilter.name);

	catch(exception: I18nValidationException, host: ArgumentsHost) {
		const lang = getClientLangFromHost(host);
		const { req } = requestHandlerFromHost(host);
		const status = HttpStatus.BAD_REQUEST;
		const res = host.switchToHttp().getResponse();

		if (req) {
			if (exception instanceof I18nValidationException) {
				const errors = formatI18nErrors(exception.errors ?? [], getGlobalI18nService(), {
					lang,
				});

				switch (host.getType() as string) {
					case 'http':
						if (res && typeof res.status === 'function') {
							return res.status(status).send({
								code: CoreErrorsEnum.ValidationError,
								message: getGlobalI18nService().t(CORE_ERRORS_ENUM_TITLES.ValidationError, { lang }),
								validationErrors: this.normalizeValidationErrors(errors),
							});
						}

						break;
					case 'graphql':
						return new GraphQLError(getGlobalI18nService().t(CORE_ERRORS_ENUM_TITLES.ValidationError, { lang }), {
							extensions: {
								errors: this.normalizeValidationErrors(errors) as I18nValidationError[],
							},
						});
				}
			}

			this.logger.error({ ...exception }, exception.stack);

			captureException(exception);

			if (res && typeof res.status === 'function') {
				return res.status(status).json({
					code: CoreErrorsEnum.UnexpectedError,
					message: CORE_ERRORS_ENUM_TITLES[CoreErrorsEnum.UnexpectedError] || '',
				});
			}
		}
	}
}
