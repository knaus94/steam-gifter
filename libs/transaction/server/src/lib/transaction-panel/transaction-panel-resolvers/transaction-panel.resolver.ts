import { CurrentUser, CurrentUserType } from '@libs/auth/server';
import { AuthGuard } from '@libs/auth/server/lib/auth-guards/auth.guard';
import { Nullable } from '@libs/core/common';
import { OKDto, PaginationArgs } from '@libs/core/server';
import { TransactionEventsService, TransactionStatusLogDto } from '@libs/transaction/server';
import { TransactionPanelStatusLogPaginatedDto } from '@libs/transaction/server/lib/transaction-panel/transaction-panel-dto/transaction-panel-status-log.dto';
import {
	TransactionPanelArgs,
	TransactionPanelDto,
	TransactionPanelPaginatedDto,
} from '@libs/transaction/server/lib/transaction-panel/transaction-panel-dto/transaction-panel.dto';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { TransactionPanelUpdateStatusArgs } from '../transaction-panel-dto/transaction-panel-update-status.dto';
import { TransactionPanelService } from '../transaction-panel-services/transaction-panel.service';

@Resolver()
@UseGuards(AuthGuard)
export class TransactionPanelResolver {
	constructor(
		private readonly transactionPanelService: TransactionPanelService,
		private readonly transactionEventsService: TransactionEventsService,
	) {}

	@Query(() => TransactionPanelPaginatedDto, { name: 'panelTransactions' })
	getTransactions(
		@Args({
			name: 'args',
			type: () => TransactionPanelArgs,
		})
		args: TransactionPanelArgs,
	): Promise<TransactionPanelPaginatedDto> {
		return this.transactionPanelService.getTransactions(args);
	}

	@Query(() => TransactionPanelDto, { name: 'panelTransaction', nullable: true })
	getTransaction(
		@Args({
			name: 'transactionId',
			type: () => Int,
		})
		transactionId: number,
	): Promise<Nullable<TransactionPanelDto>> {
		return this.transactionPanelService.getTransaction(transactionId);
	}

	@Query(() => TransactionPanelStatusLogPaginatedDto, { name: 'panelTransactionLogs' })
	getTransactionLogs(
		@Args({
			name: 'transactionId',
			type: () => Int,
		})
		transactionId: number,
		@Args({
			name: 'args',
			type: () => PaginationArgs,
		})
		args: PaginationArgs,
	): Promise<TransactionPanelStatusLogPaginatedDto> {
		return this.transactionPanelService.getTransactionLogs(transactionId, args);
	}

	@Mutation(() => TransactionPanelDto, { name: 'panelTransactionChangeBot' })
	transactionChangeBot(
		@Args({
			name: 'transactionId',
			type: () => Int,
		})
		transactionId: number,
		@Args({
			name: 'botId',
			type: () => Int,
		})
		botId: number,
	): Promise<TransactionPanelDto> {
		return this.transactionPanelService.changeBot(transactionId, botId);
	}

	@Mutation(() => OKDto, { name: 'panelTransactionResetAttempts' })
	transactionResetAttempts(
		@Args({
			name: 'transactionId',
			type: () => Int,
		})
		transactionId: number,
	): Promise<OKDto> {
		return this.transactionPanelService.resetAttempts(transactionId);
	}

	@Mutation(() => OKDto, { name: 'panelTransactionUpdateStatus' })
	transactionUpdateStatus(
		@Args({
			name: 'transactionId',
			type: () => Int,
		})
		transactionId: number,
		@Args({
			name: 'args',
			type: () => TransactionPanelUpdateStatusArgs,
		})
		args: TransactionPanelUpdateStatusArgs,
	): Promise<OKDto> {
		return this.transactionPanelService.updateStatus(transactionId, args);
	}

	@Mutation(() => OKDto, { name: 'panelTransactionUpdateProfileLink' })
	transactionUpdateProfileLink(
		@Args({
			name: 'transactionId',
			type: () => Int,
		})
		transactionId: number,
		@Args({
			name: 'profileLink',
			type: () => String,
		})
		profileLink: string,
	): Promise<OKDto> {
		return this.transactionPanelService.updateProfileLink(transactionId, profileLink);
	}

	@Subscription(() => TransactionStatusLogDto, {
		name: `Panel${TransactionEventsService.TransactionStatusStream}`,
		resolve: (payload: TransactionStatusLogDto) => {
			return payload;
		},
	})
	transactionStatusStream() {
		return this.transactionEventsService.asyncIteratorForTransactionStatusStream();
	}
}
