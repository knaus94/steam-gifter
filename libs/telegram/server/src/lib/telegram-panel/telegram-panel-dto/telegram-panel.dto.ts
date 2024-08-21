import { BooleanField, DtoType, IdField, NumberField, StringField } from '@libs/core/server';
import { Prisma } from '@prisma/client';
import { TelegramConfigType } from '../../telegram-types/telegram-config.types';

@DtoType(TelegramPanelConfigDto.name)
export class TelegramPanelConfigDto implements TelegramConfigType {
	@StringField({ nullable: true })
	balanceChatId: string | null;

	@BooleanField()
	balanceNotification: boolean;

	@NumberField()
	balanceThreshold: number;

	@StringField({ nullable: true })
	botToken: string | null;

	@IdField()
	id: number;

	@StringField({ nullable: true })
	statusChangeChatId: string | null;

	@BooleanField()
	statusChangeNotification: boolean;

	@StringField({ nullable: true })
	productPricesUpdatedChatId: string | null;

	@BooleanField()
	productPricesUpdatedNotification: boolean;
}

@DtoType(TelegramPanelConfigUpdateArgs.name)
export class TelegramPanelConfigUpdateArgs implements Prisma.TelegramConfigUncheckedUpdateInput {
	@StringField({ nullable: true })
	balanceChatId: string | null;

	@BooleanField()
	balanceNotification: boolean;

	@NumberField()
	balanceThreshold: number;

	@StringField({ nullable: true })
	botToken: string | null;

	@StringField({ nullable: true })
	statusChangeChatId: string | null;

	@BooleanField()
	statusChangeNotification: boolean;

	@StringField({ nullable: true })
	productPricesUpdatedChatId: string | null;

	@BooleanField()
	productPricesUpdatedNotification: boolean;
}
