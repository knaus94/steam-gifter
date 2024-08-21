import { CoreErrorsEnum } from '@libs/core/common';
import { MessageAttachment } from '@slack/types';
import { getClientIp } from '@supercharge/request-ip';

export function createCodeBlock(title, code) {
	code = typeof code === 'string' ? code.trim() : JSON.stringify(code, null, 2);
	const tripleBackticks = '```';
	return `_${title}_${tripleBackticks}${code}${tripleBackticks}\n`;
}

export function createSlackErrorAttachments(
	err: any,
	req?: any,
	options?: {
		application: 'server' | 'client' | 'client-panel';
	},
) {
	const request = {
		method: req?.method,
		url: req?.url,
		headers: req?.headers,
		query: req?.query,
		body: req?.body || {},
	};
	const codeArray: { title: string; code: any }[] = [];
	const attachment: MessageAttachment & { type: string; username: string; icon_emoji: string } = {
		type: 'section',
		fallback: err.name && err.message ? `${err.name}: ${err.message}` : String(err),
		color: err.code === CoreErrorsEnum.UnexpectedError ? 'danger' : 'warning',
		username: 'Паникер',
		author_name: req?.headers?.host,
		title: `${err.name}: ${err.message}`,
		fields: [],
		text: '',
		mrkdwn_in: ['text'],
		footer: options?.application,
		icon_emoji: ':exploding_head:',
		ts: String(Math.floor(Date.now() / 1000)),
	};
	if (attachment.fields) {
		if (req?.url) {
			attachment.fields.push({ title: 'Request URL', value: req.url, short: true });
		}
		if (req?.method) {
			attachment.fields.push({ title: 'Request Method', value: req.method, short: true });
		}
		if (err?.code || err?.status) {
			attachment.fields.push({ title: 'Status Code', value: err.code || err.status, short: true });
		}
		if (req && getClientIp(req)) {
			attachment.fields.push({ title: 'Remote Address', value: getClientIp(req) || 'none', short: true });
		}
	}
	if (err?.stack) {
		codeArray.push({ title: 'Stack', code: err.stack });
	}
	if (err?.request) {
		codeArray.push({ title: 'Request', code: request });
	}
	attachment.text = codeArray.map((data) => createCodeBlock(data.title, data.code)).join('');
	return [attachment];
}

export function createSlackDoneAttachments(
	doneData: any,
	req?: any,
	options?: {
		application: 'server' | 'client' | 'client-panel';
	},
) {
	const request = {
		method: req?.method,
		url: req?.url,
		headers: req?.headers,
		query: req?.query,
		body: req?.body || {},
	};
	const codeArray: { title: string; code: any }[] = [];
	const attachment: MessageAttachment & { type: string; username: string; icon_emoji: string } = {
		type: 'section',
		fallback: doneData.name && doneData.message ? `${doneData.name}: ${doneData.message}` : String(doneData),
		color: '#2EB67D',
		username: 'Добряк',
		author_name: req?.headers?.host,
		title: `${doneData.name}: ${doneData.message}`,
		fields: [],
		text: '',
		mrkdwn_in: ['text'],
		footer: options?.application,
		icon_emoji: ':blush:',
		ts: String(Math.floor(Date.now() / 1000)),
	};

	if (attachment.fields) {
		if (req?.url) {
			attachment.fields.push({ title: 'Request URL', value: req.url, short: true });
		}
		if (req?.method) {
			attachment.fields.push({ title: 'Request Method', value: req.method, short: true });
		}
		if (doneData?.code || doneData?.status) {
			attachment.fields.push({ title: 'Status Code', value: doneData.code || doneData.status, short: true });
		}
		if (getClientIp(req)) {
			attachment.fields.push({ title: 'Remote Address', value: getClientIp(req) || 'none', short: true });
		}
	}
	if (doneData?.stack) {
		codeArray.push({ title: 'Stack', code: doneData.stack });
	}
	if (doneData?.request) {
		codeArray.push({ title: 'Request', code: request });
	}
	attachment.text = codeArray.map((data) => createCodeBlock(data.title, data.code)).join('');
	return [attachment];
}

export function createSlackPauseAttachments(
	doneData: any,
	req?: any,
	options?: {
		application: 'server' | 'client' | 'client-panel';
	},
) {
	const request = {
		method: req?.method,
		url: req?.url,
		headers: req?.headers,
		query: req?.query,
		body: req?.body || {},
	};
	const codeArray: { title: string; code: any }[] = [];
	const attachment: MessageAttachment & { type: string; icon_emoji: string; username: string } = {
		type: 'section',
		fallback: doneData.name && doneData.message ? `${doneData.name}: ${doneData.message}` : String(doneData),
		color: '#36C5F0',
		username: 'Пацанчик',
		author_name: req?.headers?.host,
		title: `${doneData.name}: ${doneData.message}`,
		fields: [],
		text: '',
		mrkdwn_in: ['text'],
		footer: options?.application,
		icon_emoji: ':slightly_frowning_face:',
		ts: String(Math.floor(Date.now() / 1000)),
	};

	if (attachment.fields) {
		if (req?.url) {
			attachment.fields.push({ title: 'Request URL', value: req.url, short: true });
		}
		if (req?.method) {
			attachment.fields.push({ title: 'Request Method', value: req.method, short: true });
		}
		if (doneData?.code || doneData?.status) {
			attachment.fields.push({ title: 'Status Code', value: doneData.code || doneData.status, short: true });
		}
		if (getClientIp(req)) {
			attachment.fields.push({ title: 'Remote Address', value: getClientIp(req) || 'none', short: true });
		}
		if (doneData?.stack) {
			codeArray.push({ title: 'Stack', code: doneData.stack });
		}
		if (doneData?.request) {
			codeArray.push({ title: 'Request', code: request });
		}
	}
	attachment.text = codeArray.map((data) => createCodeBlock(data.title, data.code)).join('');
	return [attachment];
}
