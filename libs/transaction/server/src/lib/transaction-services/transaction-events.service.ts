import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ReplaySubject } from 'rxjs';
import { TransactionStatusLogDto } from '../transaction-dto/transaction-status-log.dto';

@Injectable()
export class TransactionEventsService extends PubSub {
	private TransactionStatus$ = new ReplaySubject<TransactionStatusLogDto>();

	public static TransactionStatusStream = 'TransactionStatusStream';

	public sendToTransactionStatusStream(event: TransactionStatusLogDto) {
		this.TransactionStatus$.next(event);

		return this.publish(TransactionEventsService.TransactionStatusStream, event);
	}

	public listenTransactionStatusStream() {
		return this.TransactionStatus$;
	}

	public asyncIteratorForTransactionStatusStream() {
		return this.asyncIterator(TransactionEventsService.TransactionStatusStream);
	}
}
