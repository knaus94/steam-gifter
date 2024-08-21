import { Nullable } from '@libs/core/common';
import { DtoType, StringField } from '@libs/core/server';
import { Prisma } from '@prisma/client';
import { ConfigDto } from '../../config-dto/config.dto';
import { ConfigType } from '../../config-types/config.types';

@DtoType(ConfigPanelDto.name)
export class ConfigPanelDto extends ConfigDto implements ConfigType {}

@DtoType(ConfigPanelUpdateArgs.name)
export class ConfigPanelUpdateArgs implements Prisma.ConfigUncheckedUpdateInput {
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
