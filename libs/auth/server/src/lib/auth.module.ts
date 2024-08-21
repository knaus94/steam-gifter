import { CustomInjectorModule } from '@libs/custom-injector/server';
import { SdkPrismaModule } from '@libs/sdk-prisma/server';
import { UserModule } from '@libs/user/server';
import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClsModule } from 'nestjs-cls';
import passport from 'passport';
import { AUTH_CONFIG, AuthConfig } from './auth-configs/auth.config';
import { AuthExceptionFilter } from './auth-filters/auth-exception.filter';
import { AuthResolver } from './auth-resolvers/auth.resolver';
import { AuthService } from './auth-services/auth.service';
import { AuthJwtStrategy } from './auth-strategies/auth-jwt.strategy';

passport.serializeUser((user, done) => done(null, user));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
passport.deserializeUser((obj, done) => done(null, obj));

@Module({})
export class AuthModule {
	static forRoot(authConfig: AuthConfig): DynamicModule {
		return {
			module: AuthModule,
			imports: [
				SdkPrismaModule,
				CustomInjectorModule,
				ClsModule,
				UserModule,
				PassportModule,
				JwtModule.register({
					secret: authConfig.jwtSecret,
					signOptions: {
						expiresIn: `${authConfig.jwtExpireMs}ms`,
					},
				}),
			],
			providers: [
				{ provide: AUTH_CONFIG, useValue: { ...authConfig } },
				AuthJwtStrategy,
				AuthService,
				AuthResolver,
				{
					provide: APP_FILTER,
					useClass: AuthExceptionFilter,
				},
			],
		};
	}
}
