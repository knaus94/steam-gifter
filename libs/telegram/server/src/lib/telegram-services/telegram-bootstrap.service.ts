import { BotEventsService } from '@libs/bot/server';
import { ProductUpdaterEventsService } from '@libs/product/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { TelegramConfigService } from '@libs/telegram/server/lib/telegram-services/telegram-config.service';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramBootstrapService implements OnApplicationBootstrap {
	private readonly logger = new Logger(TelegramBootstrapService.name);

	constructor(
		private readonly botEventsService: BotEventsService,
		private readonly telegramConfigService: TelegramConfigService,
		private readonly productUpdaterEventsService: ProductUpdaterEventsService,
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly telegramService: TelegramService,
	) {}

	onApplicationBootstrap() {
		this.logger.log('onApplicationBootstrap');

		this.subscribeToListenProductsPriceUpdatedStream();
		this.subscribeToListenBotStatusStream();
		this.subscribeToListenBotWalletBalanceStream();
	}

	/**
	 * Уведомляшка апдейта цен на игры
	 */
	private subscribeToListenProductsPriceUpdatedStream() {
		this.logger.debug('subscribeToListenProductsPriceUpdatedStream');
		this.productUpdaterEventsService.listenProductsPriceUpdatedStream().subscribe(async ({ products }) => {
			const config = await this.telegramConfigService.getConfig();

			if (!config.productPricesUpdatedChatId || !config.botToken || !config.productPricesUpdatedNotification) return;

			await this.telegramService.sendMessage(
				config.botToken!,
				config.productPricesUpdatedChatId!,
				`Prices updated:\n\n${products
					.map((product) => `${product.name}\n${Object.keys(product.prices).map((region) => `${region} - ${product.prices[region]}`)}`)
					.join('\n\n')})}`,
			);
		});
	}

	/**
	 * Уведомляшка апдейт статуса бота
	 */
	private subscribeToListenBotStatusStream() {
		this.logger.debug('subscribeToListenBotStatusStream');
		this.botEventsService.listenBotStatusStream().subscribe(async ({ bot: { accountName, steamId64 }, newStatus, errCode, errMsg }) => {
			const config = await this.telegramConfigService.getConfig();
			if (!config.botToken || !config.statusChangeNotification || !config.statusChangeChatId) return;

			return this.telegramService.sendMessage(
				config.botToken!,
				config.statusChangeChatId!,
				`🤖 Bot: ${accountName} (${steamId64}) | Current status: ${newStatus}${
					errCode ? ` (${errCode}) | ${errMsg ?? 'No description'}` : ''
				}`,
			);
		});
	}

	/**
	 * Уведомляшка при апдейте баланса бота
	 */
	private subscribeToListenBotWalletBalanceStream() {
		this.logger.debug('subscribeToListenBotWalletBalanceStream');
		this.botEventsService.listenBotWalletBalanceStream().subscribe(async ({ bot: { accountName, steamId64, region }, newBalance }) => {
			const config = await this.telegramConfigService.getConfig();
			if (!config.botToken || !config.balanceNotification || !config.balanceChatId || newBalance > config.balanceThreshold) return;

			return this.telegramService.sendMessage(
				config.botToken!,
				config.balanceChatId!,
				`🤖 Bot: ${accountName} (${steamId64}) | Current Balance: ${newBalance.toFixed(2)} ${region}`,
			);
		});
	}
}
