import { AuthErrorsEnum } from '@libs/auth/common';
import { getClientLangFromCtx, getGlobalI18nService, requestHandlerFromCtx } from '@libs/core/server';
import { Catch, ExceptionFilter, ExecutionContext, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { captureException } from '@sentry/node';
import { Response } from 'express';
import { AuthError } from '../auth-errors/auth-error';
import { AUTH_ERRORS_ENUM_TITLES } from '../auth-errors/auth-errors-titles.enum';

@Catch(AuthError, UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
	private logger = new Logger(AuthExceptionFilter.name);

	catch(exception: AuthError | UnauthorizedException, ctx: ExecutionContext): any {
		const { req } = requestHandlerFromCtx(ctx);
		const context = ctx.switchToHttp();
		const res = context.getResponse<Response>();
		const status = HttpStatus.BAD_REQUEST;
		const lang = getClientLangFromCtx(ctx);

		if (req) {
			if (exception instanceof UnauthorizedException) {
				this.logger.error(exception, exception.stack);
			} else {
				this.logger.error({ ...exception }, exception.stack);

				captureException(exception);
			}

			if (res && typeof res.status === 'function') {
				res.status(status).json({
					code: AuthErrorsEnum.Unauthorized,
					message: getGlobalI18nService().t(AUTH_ERRORS_ENUM_TITLES[AuthErrorsEnum.Unauthorized], { lang }),
				});
			}
		}
	}
}
