import type SteamStoreWebApi from '@libs/steam-store-web-api/steam-store-web-api';
import type SteamUser from 'steam-user';
import type SteamCommunity from 'steamcommunity';
import { BotLoginType } from '../bot-types/bot-login.types';

export interface BotInterface {
	client: SteamUser;
	community: SteamCommunity;
	store: SteamStoreWebApi;
	account: BotLoginType;
	session?: {
		createdAt: Date;
	};
}
