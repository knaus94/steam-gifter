import { AuthErrorsEnum } from '@libs/auth/common';
import { ClsCustomStore } from '@libs/core/server';
import { CustomInjectorService } from '@libs/custom-injector/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { UserHelpersService } from '@libs/user/server';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ClsService } from 'nestjs-cls';
import { AUTH_CONFIG, AuthConfig } from '../auth-configs/auth.config';
import { AuthError } from '../auth-errors/auth-error';
import { AuthTokenPayload } from '../auth-interfaces/auth-token-payload.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly clsService: ClsService<ClsCustomStore>,
		private readonly jwtService: JwtService,
		private readonly customInjectorService: CustomInjectorService,
		private readonly userHelpersService: UserHelpersService,
	) {}

	get authConfig() {
		return this.customInjectorService.getLastComponentByName<AuthConfig>(AUTH_CONFIG)!;
	}

	async logIn(email: string, password: string) {
		const user = await this.getUser(email, password);

		if (!user) {
			throw new AuthError(AuthErrorsEnum.LoginError, this.clsService.get().i18n);
		}

		const payload: AuthTokenPayload = {
			sub: user.id,
			createdAt: new Date(),
			ipAddress: this.clsService.get().ipAddress,
		};

		const token = this.jwtService.sign(payload);

		return this.sdkPrismaService.userLoginLogs
			.create({
				data: {
					userId: payload.sub,
					ipAddress: payload.ipAddress,
					userAgent: this.clsService.get().userAgent,
				},
			})
			.then(() => ({
				user,
				token,
				expiresAt: new Date(new Date().getTime() + this.authConfig.jwtExpireMs),
			}));
	}

	public async getUser(email: string, plainTextPassword?: string) {
		const user = await this.userHelpersService.getUserByEmail(email);

		if (!user) {
			return null;
		}

		if (!plainTextPassword) {
			return user;
		}

		const isPasswordMatching = await compare(plainTextPassword, user.hashedPassword);

		if (!isPasswordMatching) {
			return null;
		}

		return user;
	}
}
