import { AuthErrorsEnum } from '@libs/auth/common';
import { getClientLangFromCtx, getGlobalI18nService, requestHandlerFromCtx } from '@libs/core/server';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as AuthJwtGuard } from '@nestjs/passport';
import { CurrentUserType } from '../auth-decorators/current-user.decorator';
import { AuthError } from '../auth-errors/auth-error';

@Injectable()
export class AuthGuard extends AuthJwtGuard('jwt') implements CanActivate {
	private logger = new Logger(AuthGuard.name);

	constructor(private readonly reflector: Reflector) {
		super();
	}

	getRequest(context: ExecutionContext) {
		return requestHandlerFromCtx(context).req;
	}

	async canActivate(context: ExecutionContext) {
		const { req } = requestHandlerFromCtx(context);
		const lang = getClientLangFromCtx(context);

		try {
			await super.canActivate(context);
		} catch (err) {
			if (req?.authInfo?.message === 'jwt expired') {
				throw new AuthError(AuthErrorsEnum.AccessTokenExpired, getGlobalI18nService(), { lang });
			}

			this.logger.error(req?.authInfo || err, err.stack);

			throw err;
		}

		return true;
	}

	handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext) {
		const lang = getClientLangFromCtx(context);
		if (err || info || !user) {
			throw new AuthError(AuthErrorsEnum.Unauthorized, getGlobalI18nService(), { lang });
		}

		return user as TUser;
	}
}
