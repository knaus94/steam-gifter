import { Nullable } from '@libs/core/common';
import { DateField, DtoType, EnumField, IdField, StringField, TypedField } from '@libs/core/server';
import { TransactionEventEnum, TransactionStatusEnum } from '@prisma/client';
import { TransactionStatusLogTransactionType, TransactionStatusLogType } from '../transaction-types/transaction-status-log.types';

@DtoType(TransactionStatusLogTransactionDto.name)
export class TransactionStatusLogTransactionDto implements TransactionStatusLogTransactionType {
	@IdField()
	id: number;

	paymentDetails: {
		uniqCode: string;
	};
}

@DtoType(TransactionStatusLogDto.name)
export class TransactionStatusLogDto implements TransactionStatusLogType {
	@IdField()
	id: number;

	@EnumField(TransactionStatusEnum, 'TransactionStatusEnum')
	status: TransactionStatusEnum;

	@EnumField(TransactionEventEnum, 'TransactionEventEnum', { nullable: true })
	event: Nullable<TransactionEventEnum>;

	//TODO: скрыть от неавторизованных
	@StringField({ nullable: true })
	errMsg: Nullable<string>;

	@DateField()
	createdAt: Date;

	@TypedField(() => TransactionStatusLogTransactionDto)
	transaction: TransactionStatusLogTransactionDto;
}
