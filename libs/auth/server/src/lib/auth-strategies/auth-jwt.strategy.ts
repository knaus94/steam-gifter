import { Nullable } from '@libs/core/common';
import { CustomInjectorService } from '@libs/custom-injector/server';
import { UserHelpersService, UserType } from '@libs/user/server';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import mem from 'mem';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_CONFIG, AuthConfig } from '../auth-configs/auth.config';
import { AuthTokenPayload } from '../auth-interfaces/auth-token-payload.interface';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userHelpersService: UserHelpersService,
		private readonly customInjectorService: CustomInjectorService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: customInjectorService.getLastComponentByName<AuthConfig>(AUTH_CONFIG)!.jwtSecret,
		});
	}

	// кэшируем юзера на 5 сек, частично снизит нагрузку на одновременные запросы
	private getUserById = mem(UserHelpersService.prototype.getUserById, {
		maxAge: 5000,
	});

	async validate({ sub }: AuthTokenPayload): Promise<UserType> {
		const user: Nullable<UserType> = await this.getUserById.call(this.userHelpersService, sub);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
