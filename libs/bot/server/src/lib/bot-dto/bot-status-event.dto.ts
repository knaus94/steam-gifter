import { Nullable } from '@libs/core/common';
import { DtoType, EnumField, IdField, StringField } from '@libs/core/server';
import { BotErrCodeEnum, BotStatusEnum } from '@prisma/client';

@DtoType(BotStatusEventDto.name)
export class BotStatusEventDto {
	@IdField()
	botId: number;

	@EnumField(BotStatusEnum, 'BotStatusEnum')
	newStatus: BotStatusEnum;

	@EnumField(BotErrCodeEnum, 'BotErrCodeEnum', { nullable: true })
	errCode: Nullable<BotErrCodeEnum>;

	@StringField({ nullable: true })
	errMsg: Nullable<string>;
}
