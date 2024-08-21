import { Nullable } from '@libs/core/common';
import { DtoType, EnumField, IdField, StringField } from '@libs/core/server';
import { RegionCodeEnum } from '@prisma/client';
import { BotType } from '../bot-types/bot.types';

@DtoType(BotDto.name)
export class BotDto implements BotType {
	@IdField()
	id: number;

	@StringField()
	accountName: string;

	@StringField({ nullable: true })
	avatarUrl: Nullable<string>;

	@EnumField(RegionCodeEnum, 'RegionCodeEnum')
	region: RegionCodeEnum;

	@StringField()
	steamId64: string;
}
