import { CustomInjectorService } from '@libs/custom-injector/server';
import { Injectable, Logger } from '@nestjs/common';
import { IncomingWebhookSendArguments } from '@slack/webhook';
import axios, { AxiosResponse } from 'axios';
import { from, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SlackConfig } from '../slack-config/slack.config';

interface SlackChatPostMessageRequest {
	message: string;
}

@Injectable()
export class SlackService {
	private logger = new Logger(SlackService.name);

	constructor(private readonly customInjectorService: CustomInjectorService) {}

	public send(request: IncomingWebhookSendArguments & { channel?: string }): void {
		const config = this.customInjectorService.getLastComponentByName<SlackConfig>('SLACK_CONFIG')!;
		if (!config.enable) {
			return;
		}
		const url = 'https://slack.com/api/chat.postMessage';

		if (request.attachments) {
			if (request.attachments.length > 0 && request.attachments[0].footer) {
				if (config.tag) {
					request.attachments[0].footer = `${config.serviceName || request.attachments[0].footer} (${config.tag})`;
				} else {
					request.attachments[0].footer = `${config.serviceName || request.attachments[0].footer}`;
				}
			} else {
				request.attachments[0].footer = config.serviceName ? `${config.serviceName} (${config.tag})` : config.tag;
			}
			if (request.attachments?.length > 0) {
				request.attachments[0].author_name = `<${config.domain}|${config.domain}>`;
			}
			if (!request.channel) {
				request.channel = config.channel;
			}
			if (!request.icon_emoji && request.attachments?.length > 0 && (request.attachments[0] as any).icon_emoji) {
				request.icon_emoji = (request.attachments[0] as any).icon_emoji;
			}
			if (!request.username && request.attachments?.length > 0 && (request.attachments[0] as any).username) {
				request.username = (request.attachments[0] as any).username;
			}
		}

		from(axios.post(url, request, { headers: { authorization: `Bearer ${config.accessToken}` } }))
			.pipe(
				catchError((err) => {
					this.logger.debug(request);
					this.logger.error(err, err.stack);
					return throwError(() => err);
				}),
				map((res: AxiosResponse<any>) => res.data),
				tap((data: SlackChatPostMessageRequest) => {
					if (!data.message) {
						this.logger.debug(request);
						this.logger.error(data);
					}
				}),
				catchError((err) => {
					this.logger.debug(request);
					this.logger.error(err, err.stack);
					return of(null);
				}),
			)
			.subscribe();
	}
}
