import { EFriendRelationship as BotFriendRelationshipEnum } from 'steam-user';
import { BotType } from '../bot-types/bot.types';

export interface BotFriendRelationshipEventInterface {
	bot: BotType;
	steamId64: string;
	relationship: BotFriendRelationshipEnum;
}
