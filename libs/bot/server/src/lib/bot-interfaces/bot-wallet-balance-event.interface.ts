import { BotType } from '../bot-types/bot.types';

export interface BotWalletBalanceEventInterface {
	bot: BotType;
	newBalance: number;
}
