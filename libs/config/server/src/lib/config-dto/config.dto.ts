import { ConfigType } from '@libs/config/server';
import { Nullable } from '@libs/core/common';
import { DtoType, IdField, StringField } from '@libs/core/server';

@DtoType(ConfigDto.name)
export class ConfigDto implements ConfigType {
	@IdField()
	id: number;

	@StringField({ nullable: true })
	skypeLink: Nullable<string>;

	@StringField({ nullable: true })
	supportLink: Nullable<string>;

	@StringField({ nullable: true })
	telegramLogin: Nullable<string>;

	@StringField({ nullable: true })
	vkLink: Nullable<string>;

	@StringField({ nullable: true })
	email: Nullable<string>;

	@StringField({ nullable: true })
	discordLink: Nullable<string>;
}
