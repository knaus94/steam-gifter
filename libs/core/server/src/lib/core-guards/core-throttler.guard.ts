import { AuthTokenPayload } from '@libs/auth/server';
import { CoreErrorsEnum } from '@libs/core/common';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard as ThrottlerGuardOrigin, ThrottlerOptions } from '@nestjs/throttler';
import { CoreError } from '../core-errors/core-error';
import { getClientLangFromCtx } from '../core-helpers/i18n-handler';
import { requestHandlerFromCtx } from '../core-helpers/request-handler';
import { getGlobalI18nService } from '../core-interfaces/i18n.interface';

@Injectable()
export class ThrottlerGuard extends ThrottlerGuardOrigin {
	async handleRequest(context: ExecutionContext, limit: number, ttl: number, throttler: ThrottlerOptions): Promise<boolean> {
		const { req, res } = requestHandlerFromCtx(context);

		const ignoreUserAgents = throttler.ignoreUserAgents ?? this.commonOptions.ignoreUserAgents;

		if (Array.isArray(ignoreUserAgents)) {
			for (const pattern of ignoreUserAgents) {
				if (pattern.test(req.headers['user-agent'])) {
					return true;
				}
			}
		}

		let tracker = await this.getTracker(req);

		if (req.headers?.authorization) {
			try {
				tracker = (
					JSON.parse(Buffer.from(req.headers?.authorization.split(' ')[1].split('.')[1], 'base64').toString()) as AuthTokenPayload
				).sub.toString();
			} catch (error) {}
		}

		const key = this.generateKey(context, tracker, throttler?.name ?? 'default');
		const { totalHits, timeToExpire } = await this.storageService.increment(key, ttl);
		if (totalHits > limit) {
			if (res) res.header('Retry-After', timeToExpire);
			this.throwException(context, timeToExpire);
		}

		if (res) {
			res.header(`${this.headerPrefix}-Limit`, limit);
			res.header(`${this.headerPrefix}-Remaining`, Math.max(0, limit - totalHits));
			res.header(`${this.headerPrefix}-Reset`, timeToExpire);
		}

		return true;
	}

	getRequestResponse(context: ExecutionContext) {
		return requestHandlerFromCtx(context).res;
	}

	throwException(context: ExecutionContext, nearestExpiryTime: number): void {
		const lang = getClientLangFromCtx(context);

		throw new CoreError(CoreErrorsEnum.TooManyRequests, getGlobalI18nService(), {
			lang,
			args: {
				nearestExpiryTime,
			},
		});
	}
}
