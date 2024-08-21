import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthService } from '../auth-services/auth.service';
import { AuthLogInArgs, AuthLogInDto } from './../auth-dto/auth-log-in.dto';

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Recaptcha({ action: 'PanelLogIn' })
	@Throttle({ default: { limit: 10, ttl: 20 * 60 } })
	@Mutation(() => AuthLogInDto, { name: 'panelLogIn' })
	logIn(
		@Args({
			name: 'args',
			type: () => AuthLogInArgs,
		})
		args: AuthLogInArgs,
	): Promise<AuthLogInDto> {
		return this.authService.logIn(args.email, args.password);
	}
}
