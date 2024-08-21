import { BooleanField, DateField, DtoType, IdField, StringField } from '@libs/core/server';
import { UserType } from '../user-types/user.types';

@DtoType(UserDto.name)
export class UserDto implements UserType {
	@IdField()
	id: number;

	@StringField()
	email: string;

	@StringField({ isHidden: true })
	hashedPassword: string;
}
