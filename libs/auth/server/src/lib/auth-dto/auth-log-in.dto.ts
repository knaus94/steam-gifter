import { DateField, DtoType, StringField, TypedField } from '@libs/core/server';
import { UserDto } from '@libs/user/server';
import { IsEmail } from 'class-validator';

@DtoType(AuthLogInArgs.name)
export class AuthLogInArgs {
	@StringField() @IsEmail() email: string;

	@StringField() password: string;
}

@DtoType(AuthLogInDto.name)
export class AuthLogInDto {
	@TypedField(() => UserDto) user: UserDto;

	@StringField() token: string;

	@DateField() expiresAt: Date;
}
