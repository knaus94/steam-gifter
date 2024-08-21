import CEconItem from 'steamcommunity/classes/CEconItem';
import { BotType } from '../bot-types/bot.types';

export interface BotInventoryEventInterface {
	bot: BotType;
	newInventory: CEconItem[];
}
