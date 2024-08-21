import { Nullable } from '@libs/core/common';
import { BotErrCodeEnum, BotStatusEnum } from '@prisma/client';
import { BotType } from '../bot-types/bot.types';

export interface BotStatusEventInterface {
	bot: BotType;
	newStatus: BotStatusEnum;
	errCode: Nullable<BotErrCodeEnum>;
	errMsg: Nullable<string>;
}
