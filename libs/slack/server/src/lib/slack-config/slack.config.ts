export const SLACK_CONFIG = 'SLACK_CONFIG';

export interface SlackConfig {
	serviceName: string;
	enable?: boolean;
	domain: string;
	tag: string;
	channel: string;
	accessToken: string;
}
