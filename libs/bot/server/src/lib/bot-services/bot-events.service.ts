import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ReplaySubject } from 'rxjs';
import { BotStatusEventDto } from '../bot-dto/bot-status-event.dto';
import { BotFriendRelationshipEventInterface } from '../bot-interfaces/bot-friend-relationship-event.interface';
import { BotInventoryEventInterface } from '../bot-interfaces/bot-inventory-event.interface';
import { BotStatusEventInterface } from '../bot-interfaces/bot-status-event.interface';
import { BotWalletBalanceEventInterface } from '../bot-interfaces/bot-wallet-balance-event.interface';

@Injectable()
export class BotEventsService extends PubSub {
	private BotWalletBalance$ = new ReplaySubject<BotWalletBalanceEventInterface>();
	private BotFriendRelationship$ = new ReplaySubject<BotFriendRelationshipEventInterface>();
	private BotStatus$ = new ReplaySubject<BotStatusEventInterface>();
	private BotInventory$ = new ReplaySubject<BotInventoryEventInterface>();

	public static BotStatusStream = 'BotStatusStream';

	public sendToBotWalletBalanceStream(event: BotWalletBalanceEventInterface) {
		this.BotWalletBalance$.next(event);
	}

	public listenBotWalletBalanceStream() {
		return this.BotWalletBalance$;
	}

	public sendToBotFriendRelationshipStream(event: BotFriendRelationshipEventInterface) {
		this.BotFriendRelationship$.next(event);
	}

	public listenBotFriendRelationshipStream() {
		return this.BotFriendRelationship$;
	}

	public sendToBotStatusStream(event: BotStatusEventInterface) {
		this.BotStatus$.next(event);

		const data: BotStatusEventDto = {
			botId: event.bot.id,
			newStatus: event.newStatus,
			errCode: event.errCode,
			errMsg: event.errMsg,
		};

		return this.publish(BotEventsService.BotStatusStream, data);
	}

	public listenBotStatusStream() {
		return this.BotStatus$;
	}

	public sendToBotInventoryStream(event: BotInventoryEventInterface) {
		this.BotInventory$.next(event);
	}

	public listenBotInventoryStream() {
		return this.BotInventory$;
	}

	public asyncIteratorForBotStatusStream() {
		return this.asyncIterator(BotEventsService.BotStatusStream);
	}
}
