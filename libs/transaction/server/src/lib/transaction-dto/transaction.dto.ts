import { BotDto } from '@libs/bot/server/lib/bot-dto/bot.dto';
import { Nullable } from '@libs/core/common';
import { DateField, DtoType, EnumField, IdField, NumberField, StringField, TranslationDto, TypedField } from '@libs/core/server';
import { TransactionStatusEnum } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import {
	TransactionEditionDigisellerProductType,
	TransactionEditionType,
	TransactionPaymentDetailsType,
	TransactionType,
} from '../transaction-types/transaction.types';
import { TransactionStatusLogDto } from './transaction-status-log.dto';

@DtoType(TransactionArgs.name)
export class TransactionArgs {
	@StringField()
	@IsNotEmpty()
	uniqCode: string;
}

@DtoType(TransactionPaymentDetailsDto.name)
export class TransactionPaymentDetailsDto implements TransactionPaymentDetailsType {
	@NumberField()
	invoice: number;
}

@DtoType(TransactionEditionDigisellerProductDto.name)
export class TransactionEditionDigisellerProductDto implements TransactionEditionDigisellerProductType {
	@TypedField(() => TranslationDto)
	name: PrismaJson.TranslationType;

	@StringField({ nullable: true })
	previewUrl: Nullable<string>;
}

@DtoType(TransactionEditionDto.name)
export class TransactionEditionDto implements TransactionEditionType {
	@StringField({ nullable: true })
	name: Nullable<string>;

	@TypedField(() => TransactionEditionDigisellerProductDto, { name: 'product' })
	digisellerProduct: TransactionEditionDigisellerProductDto;
}

@DtoType(TransactionDto.name)
export class TransactionDto implements TransactionType {
	@IdField()
	id: number;

	@StringField()
	profileLink: string;

	@TypedField(() => BotDto, { nullable: true })
	bot: Nullable<BotDto>;

	@TypedField(() => TransactionStatusLogDto, { isArray: true })
	logs: TransactionStatusLogDto[];

	@DateField()
	createdAt: Date;

	@DateField()
	updatedAt: Date;

	@EnumField(TransactionStatusEnum, 'TransactionStatusEnum')
	status: TransactionStatusEnum;

	@StringField({ nullable: true })
	region: Nullable<string>;

	@TypedField(() => TransactionEditionDto)
	edition: TransactionEditionDto;

	@TypedField(() => TransactionPaymentDetailsDto)
	paymentDetails: TransactionPaymentDetailsDto;
}
