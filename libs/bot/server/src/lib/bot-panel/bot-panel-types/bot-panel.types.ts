import { ProxyPanelSelectedFields } from '@libs/proxy/server/lib/proxy-panel/proxy-panel-types/proxy-panel.types';
import { Prisma } from '@prisma/client';

export const BotPanelSelectedFields = Prisma.validator<Prisma.BotSelect>()({
	id: true,
	steamId64: true,
	region: true,
	accountName: true,
	login: true,
	avatarUrl: true,
	sharedSecret: true,
	balance: true,
	reservedBalance: true,
	status: true,
	errCode: true,
	errMsg: true,
	password: true,
	proxy: {
		select: {
			...ProxyPanelSelectedFields,
		},
	},
});

export type BotPanelType = Prisma.BotGetPayload<{
	select: typeof BotPanelSelectedFields;
}>;
