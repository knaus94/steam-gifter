import { DtoType, EnumField, IdField, NullTransform } from '@libs/core/server';
import { TransactionEventEnum, TransactionStatusEnum } from '@prisma/client';
import { NotEquals } from 'class-validator';

@DtoType(TransactionPanelUpdateStatusArgs.name)
export class TransactionPanelUpdateStatusArgs {
	@EnumField(TransactionStatusEnum, 'TransactionStatusEnum')
	@NotEquals(TransactionStatusEnum[TransactionStatusEnum.SUCCESS])
	currentStatus: TransactionStatusEnum;

	@EnumField(TransactionStatusEnum, 'TransactionStatusEnum')
	newStatus: TransactionStatusEnum;

	@EnumField(TransactionEventEnum, 'TransactionEventEnum', { nullable: true })
	@NullTransform()
	event?: TransactionEventEnum;
}
