import { ProxyHelpersService } from '@libs/proxy/server/lib/proxy-services/proxy-helpers.service';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { TelegramConfigService } from './telegram-config.service';

@Injectable()
export class TelegramService {
	private readonly logger = new Logger(TelegramService.name);

	constructor(
		private readonly proxyHelpersService: ProxyHelpersService,
		private readonly telegramConfigService: TelegramConfigService,
	) {}

	async sendMessage(botToken: string, chatId: string, message: string) {
		const maxMessageLength = 4000;

		if (message.length <= maxMessageLength) {
			await this.sendMessagePart(botToken, chatId, message);
		} else {
			const messageParts = this.splitMessage(message, maxMessageLength);

			for (const part of messageParts) {
				await this.sendMessagePart(botToken, chatId, part);
			}
		}
	}

	private async sendMessagePart(botToken: string, chatId: string, part: string) {
		try {
			const httpProxy = await this.proxyHelpersService.randomHttpProxy();

			return await axios.request<string>({
				url: `https://api.telegram.org/bot${botToken}/sendMessage`,
				method: 'post',
				httpsAgent: httpProxy ? new HttpsProxyAgent(httpProxy.url) : undefined,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
				},
				timeout: 5000,
				data: {
					chat_id: chatId,
					text: part,
				},
			});
		} catch (e) {
		}
	}

	private splitMessage(message: string, maxLength: number): string[] {
		const parts: string[] = [];
		for (let i = 0; i < message.length; i += maxLength) {
			parts.push(message.substring(i, i + maxLength));
		}
		return parts;
	}
}
