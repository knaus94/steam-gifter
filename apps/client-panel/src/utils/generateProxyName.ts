import { ObjectProxyPanelDto } from '@generated/client-panel/graphql/types';

type ObjectProxyPanelSubsetDto = Pick<ObjectProxyPanelDto, 'address' | 'password' | 'port' | 'username'>;

export const generateProxyName = (proxy: ObjectProxyPanelSubsetDto): string => {
	const { address, password, port, username } = proxy;
	const userPart = !username && !password ? '' : `${username ?? ''}:${password ?? ''}@`;
	return `${userPart}${address}:${port}`;
};
