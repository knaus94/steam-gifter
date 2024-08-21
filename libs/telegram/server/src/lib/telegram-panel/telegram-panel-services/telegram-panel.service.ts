import { CacheEvict } from '@knaus94/nestjs-cacheable';
import { OKDto } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger } from '@nestjs/common';
import { TelegramPanelConfigUpdateArgs } from '../../telegram-panel/telegram-panel-dto/telegram-panel.dto';
import { TelegramConfigService } from '../../telegram-services/telegram-config.service';

@Injectable()
export class TelegramPanelService {
	private readonly logger = new Logger(TelegramPanelService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly telegramConfigService: TelegramConfigService,
	) {}

	@CacheEvict({
		namespace: TelegramConfigService.name,
		key: `config`,
	})
	async updateConfig({
		botToken,
		statusChangeNotification,
		statusChangeChatId,
		balanceNotification,
		balanceChatId,
		balanceThreshold,
		productPricesUpdatedChatId,
		productPricesUpdatedNotification,
	}: TelegramPanelConfigUpdateArgs) {
		return this.telegramConfigService
			.getConfig()
			.then(({ id }) =>
				this.sdkPrismaService.telegramConfig.update({
					where: {
						id,
					},
					data: {
						botToken,
						statusChangeNotification,
						statusChangeChatId,
						balanceNotification,
						balanceChatId,
						balanceThreshold,
						productPricesUpdatedChatId,
						productPricesUpdatedNotification,
					},
				}),
			)
			.then(() => new OKDto());
	}
}
