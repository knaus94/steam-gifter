import { Proxy } from '@prisma/client';

export const buildProxy = ({ username, password, address, port }: Pick<Proxy, 'username' | 'password' | 'port' | 'address'>) =>
	!!username || !!password ? `http://${username ?? ''}:${password ?? ''}@${address}:${port}/` : `http://${address}:${port}/ d`;
