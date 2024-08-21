import { OKDto } from '@libs/core/server';
import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { TransactionStatusEnum } from '@prisma/client';
import { TransactionStatusLogDto } from '../transaction-dto/transaction-status-log.dto';
import { TransactionUpdateProfileLinkArgs } from '../transaction-dto/transaction-update-profile-link.dto';
import { TransactionArgs, TransactionDto } from '../transaction-dto/transaction.dto';
import { TransactionEventsService } from '../transaction-services/transaction-events.service';
import { TransactionService } from '../transaction-services/transaction.service';
import { TransactionStatusLogType } from '../transaction-types/transaction-status-log.types';

@Resolver(() => TransactionDto)
export class TransactionResolver {
	constructor(
		private readonly transactionService: TransactionService,
		private readonly transactionEventsService: TransactionEventsService,
	) {}

	@Recaptcha({ action: 'Transaction' })
	@Query(() => TransactionDto, { name: 'transaction' })
	getTransaction(
		@Args({
			name: 'args',
			type: () => TransactionArgs,
		})
		args: TransactionArgs,
	): Promise<TransactionDto> {
		return this.transactionService.getTransaction(args.uniqCode);
	}

	@Recaptcha({ action: 'UpdateTransactionProfileLink' })
	@Mutation(() => OKDto)
	updateTransactionProfileLink(
		@Args({
			name: 'args',
			type: () => TransactionUpdateProfileLinkArgs,
		})
		args: TransactionUpdateProfileLinkArgs,
	): Promise<OKDto> {
		return this.transactionService.updateTransactionProfileLink(args.uniqCode, args.profileLink);
	}

	@Recaptcha({ action: 'ResendTransaction' })
	@Throttle({ default: { limit: 1, ttl: 15 } })
	@Mutation(() => OKDto)
	resendTransaction(
		@Args({
			name: 'args',
			type: () => TransactionArgs,
		})
		args: TransactionArgs,
	): Promise<OKDto> {
		return this.transactionService.resendTransaction(args.uniqCode);
	}

	@Subscription(() => TransactionStatusLogDto, {
		name: TransactionEventsService.TransactionStatusStream,
		resolve: (payload: TransactionStatusLogType) => {
			return payload;
		},
		filter: (payload: TransactionStatusLogType, variables: { args: TransactionArgs }) => {
			return payload?.transaction?.paymentDetails?.uniqCode === variables?.args?.uniqCode;
		},
	})
	transactionStatusStream(
		@Args({
			name: 'args',
			type: () => TransactionArgs,
		})
		_,
	) {
		return this.transactionEventsService.asyncIteratorForTransactionStatusStream();
	}

	@ResolveField(() => [TransactionStatusLogDto], { name: 'logs' }) filterLogs(@Parent() { logs }: TransactionDto): TransactionStatusLogDto[] {
		const created = logs.find(({ status }) => status === TransactionStatusEnum.CREATED);

		if (created) {
			return logs.filter(({ createdAt }) => createdAt >= created.createdAt);
		}

		return logs;
	}
}
