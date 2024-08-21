import { BotPanelDto } from '@libs/bot/server';
import { Nullable, SortEnum } from '@libs/core/common';
import {
	ClassTransformToPaginationClass,
	DateField,
	DtoType,
	EnumField,
	IdField,
	NullTransform,
	NumberField,
	PaginationArgs,
	StringField,
	TypedField,
} from '@libs/core/server';
import { DigisellerProductEditionPanelDto } from '@libs/digiseller/server';
import {
	TransactionPanelPaymentDetailsType,
	TransactionPanelType,
} from '@libs/transaction/server/lib/transaction-panel/transaction-panel-types/transaction-panel.types';
import { Transaction, TransactionPaymentDetails, TransactionStatusEnum } from '@prisma/client';

export enum TransactionPanelSortEnum {
	id = 'id',
	createdA = 'createdAt',
	updatedAt = 'updatedAt',
	status = 'status',
}

@DtoType(TransactionPanelSortArgs.name)
export class TransactionPanelSortArgs {
	@EnumField(TransactionPanelSortEnum, 'TransactionPanelSortEnum')
	field: TransactionPanelSortEnum;

	@EnumField(SortEnum, 'SortEnum')
	type: SortEnum;
}

@DtoType(TransactionPanelArgs.name)
export class TransactionPanelArgs
	extends PaginationArgs
	implements Partial<Pick<Transaction, 'id'>>, Partial<Pick<TransactionPaymentDetails, 'uniqCode' | 'invoice'>>
{
	@NumberField({ nullable: true })
	@NullTransform()
	id?: number;

	@StringField({ nullable: true })
	@NullTransform()
	uniqCode?: string;

	@NumberField({ nullable: true })
	@NullTransform()
	invoice?: number;

	@EnumField(TransactionStatusEnum, 'TransactionStatusEnum', { nullable: true })
	@NullTransform()
	status?: TransactionStatusEnum;

	@TypedField(() => TransactionPanelSortArgs)
	sort: TransactionPanelSortArgs;
}

@DtoType(TransactionPanelPaymentDetailsDto.name)
export class TransactionPanelPaymentDetailsDto implements TransactionPanelPaymentDetailsType {
	@StringField()
	uniqCode: string;

	@NumberField()
	invoice: number;
}

@DtoType(TransactionPanelDto.name)
export class TransactionPanelDto implements TransactionPanelType {
	@IdField()
	id: number;

	@StringField()
	profileLink: string;

	@TypedField(() => BotPanelDto, { nullable: true })
	bot: Nullable<BotPanelDto>;

	@DateField()
	createdAt: Date;

	@DateField()
	updatedAt: Date;

	@EnumField(TransactionStatusEnum, 'TransactionStatusEnum')
	status: TransactionStatusEnum;

	@StringField({ nullable: true })
	region: Nullable<string>;

	@NumberField()
	sendAttempts: number;

	@StringField({ nullable: true })
	steamId64: Nullable<string>;

	@TypedField(() => TransactionPanelPaymentDetailsDto)
	paymentDetails: TransactionPanelPaymentDetailsDto;

	@TypedField(() => DigisellerProductEditionPanelDto)
	edition: DigisellerProductEditionPanelDto;
}

@DtoType(TransactionPanelPaginatedDto.name)
export class TransactionPanelPaginatedDto extends ClassTransformToPaginationClass(TransactionPanelDto) {}
