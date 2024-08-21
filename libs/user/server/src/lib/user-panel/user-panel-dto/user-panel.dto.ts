import { DtoType, StringField } from '@libs/core/server';
import { IsStrongPassword } from 'class-validator';
import { UserDto } from '../../user-dto/user.dto';

@DtoType(UserPanelDto.name)
export class UserPanelDto extends UserDto {}

@DtoType(UserPanelUpdatePasswordArgs.name)
export class UserPanelUpdatePasswordArgs {
	@StringField()
	@IsStrongPassword({
		minLength: 6,
		minUppercase: 1,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 0,
	})
	password: string;
}
