import React, { useEffect, useState } from 'react';
import {
	GetPanelProxiesQuery,
	InputProxyPanelArgs,
	ProxyPanelSortByEnumType,
	SortEnumType,
	useGetPanelProxiesLazyQuery,
} from '@generated/client-panel/graphql/types';
import './Proxy.scss';

import ProxyHeader from './ProxyHeader/ProxyHeader';
import ProxyTable from './ProxyTable/ProxyTable';

export type Data = GetPanelProxiesQuery['panelProxies']['records'];
const Proxy = () => {
	const [data, setData] = useState<Data>([]);
	const [total, setTotal] = useState(0);
	const [formData, setFormData] = useState<InputProxyPanelArgs>({
		take: 10,
		skip: 0,
		address: null,
		sort: {
			field: ProxyPanelSortByEnumType.Id,
			type: SortEnumType.Desc,
		},
	});

	const [getPanelProxies] = useGetPanelProxiesLazyQuery();

	useEffect(() => {
		(async () => {
			const { data } = await getPanelProxies({
				variables: {
					args: formData,
				},
				fetchPolicy: 'no-cache',
			});
			if (data) {
				setData(data.panelProxies.records);
				setTotal(data.panelProxies.total);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	return (
		<div className="proxy">
			<ProxyHeader setFormData={setFormData} setData={setData} />
			<ProxyTable data={data} setFormData={setFormData} formData={formData} setData={setData} total={total} />
		</div>
	);
};

export default Proxy;
