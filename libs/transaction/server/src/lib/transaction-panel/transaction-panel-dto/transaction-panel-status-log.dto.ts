import { Nullable } from '@libs/core/common';
import { ClassTransformToPaginationClass, DateField, DtoType, EnumField, IdField, StringField } from '@libs/core/server';
import { TransactionPanelStatusLogType } from '@libs/transaction/server/lib/transaction-panel/transaction-panel-types/transaction-panel-status-log.types';
import { TransactionEventEnum, TransactionStatusEnum } from '@prisma/client';

@DtoType(TransactionPanelStatusLogDto.name)
export class TransactionPanelStatusLogDto implements TransactionPanelStatusLogType {
	@IdField()
	id: number;

	@EnumField(TransactionStatusEnum, 'TransactionStatusEnum')
	status: TransactionStatusEnum;

	@EnumField(TransactionEventEnum, 'TransactionEventEnum', { nullable: true })
	event: Nullable<TransactionEventEnum>;

	@StringField({ nullable: true })
	errMsg: Nullable<string>;

	@DateField()
	createdAt: Date;
}

@DtoType(TransactionPanelStatusLogPaginatedDto.name)
export class TransactionPanelStatusLogPaginatedDto extends ClassTransformToPaginationClass(TransactionPanelStatusLogDto) {}
