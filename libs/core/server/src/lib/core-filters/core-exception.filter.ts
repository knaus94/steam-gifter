import { Catch, ExceptionFilter, ExecutionContext, HttpStatus, Logger } from '@nestjs/common';

import { CoreErrorsEnum } from '@libs/core/common';
import { createSlackErrorAttachments } from '@libs/slack/common';
import { SlackService } from '@libs/slack/server';
import { GoogleRecaptchaException } from '@nestlab/google-recaptcha';
import { captureException } from '@sentry/node';
import { Response } from 'express';
import { CoreError } from '../core-errors/core-error';
import { CORE_ERRORS_ENUM_TITLES } from '../core-errors/core-errors-titles.enum';
import { getClientLangFromCtx } from '../core-helpers/i18n-handler';
import { requestHandlerFromCtx } from '../core-helpers/request-handler';
import { getGlobalI18nService } from '../core-interfaces/i18n.interface';

@Catch(TypeError, GoogleRecaptchaException, CoreError)
export class CoreErrorsFilter implements ExceptionFilter {
	private logger = new Logger(CoreErrorsFilter.name);

	constructor(private readonly slackService: SlackService) {}

	catch(exception: TypeError, ctx: ExecutionContext) {
		const { req } = requestHandlerFromCtx(ctx);
		const context = ctx.switchToHttp();
		const res = context.getResponse<Response>();
		const status = HttpStatus.BAD_REQUEST;
		const lang = getClientLangFromCtx(ctx);

		if (req) {
			if (exception instanceof GoogleRecaptchaException) {
				switch (ctx.getType() as string) {
					case 'http':
						if (res && typeof res.status === 'function') {
							return res.status(status).send({
								code: CoreErrorsEnum.UnexpectedError,
								message: getGlobalI18nService().t(CORE_ERRORS_ENUM_TITLES.UnexpectedError, { lang }),
							});
						}

						break;
					case 'graphql':
						throw new CoreError(CoreErrorsEnum.RecaptchaValidationError, getGlobalI18nService(), { lang });
				}
			}

			if (exception instanceof CoreError) {
				if (res && typeof res.status === 'function') {
					return res.status(status).json({
						code: exception.extensions.code,
						message: exception.message,
					});
				}

				return;
			}

			this.logger.error({ ...exception }, exception.stack);

			captureException(exception);
			this.slackService.send({
				attachments: createSlackErrorAttachments(exception, req, { application: 'server' }),
			});

			if (res && typeof res.status === 'function') {
				return res.status(status).json({
					code: CoreErrorsEnum.UnexpectedError,
					message: getGlobalI18nService().t(CORE_ERRORS_ENUM_TITLES[CoreErrorsEnum.UnexpectedError], {
						lang,
					}),
				});
			}
		}
	}
}
