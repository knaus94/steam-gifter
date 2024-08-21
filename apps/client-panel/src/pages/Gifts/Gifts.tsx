import {
	DigisellerProductPanelSortEnumType,
	GetGiftsQuery,
	InputDigisellerProductPanelArgs,
	MeDocument,
	MeQuery,
	SortEnumType,
	useGetGiftsLazyQuery,
	usePanelDigisellerSyncPricesMutation,
} from '@generated/client-panel/graphql/types';
import { tuple } from '@libs/core/common';
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import client from '../../apolloClient';
import './Gifts.scss';
import GiftsTable from './GiftsTable/GiftsTable';

export type GiftsData = GetGiftsQuery['panelDigisellerProducts']['records'];

const Gifts = () => {
	const [data, setData] = useState<GiftsData>([]);
	const [total, setTotal] = useState(0);
	const [messageApi, contextHolder] = message.useMessage();

	const { t } = useTranslation();
	const navigate = useNavigate();
	const [formData, setFormData] = useState<InputDigisellerProductPanelArgs>({
		take: 10,
		skip: 0,
		name: null,
		id: null,
		isDisabled: null,
		digisellerId: null,
		sort: {
			field: DigisellerProductPanelSortEnumType.Id,
			type: SortEnumType.Desc,
		},
	});

	const { me } =
		client.readQuery<MeQuery>({
			query: MeDocument,
		}) || {};

	const [getGifts] = useGetGiftsLazyQuery();
	const [syncPrices, { loading: syncLoading }] = usePanelDigisellerSyncPricesMutation();

	useEffect(() => {
		(async () => {
			const { data } = await getGifts({
				variables: {
					args: formData,
				},
				fetchPolicy: 'no-cache',
			});
			if (data) {
				setData(data.panelDigisellerProducts.records);
				setTotal(data.panelDigisellerProducts.total);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	const syncPricesHandle = async () => {
		const [res, resError] = await tuple(syncPrices({ fetchPolicy: 'network-only', errorPolicy: 'none' }));
		const err = resError ?? res.errors?.[0];
		if (err) {
			return messageApi.open({
				type: 'error',
				content: err.message,
			});
		}

		return messageApi.open({
			type: 'success',
			content: t('gifts.sync_price_sended'),
		});
	};
	return (
		<div className="gifts">
			{contextHolder}
			<Button type="primary" onClick={() => navigate('/gifts/create')}>
				{t('gifts.create.title')}
			</Button>
			<Button type="primary" onClick={() => syncPricesHandle()} loading={syncLoading} style={{ float: 'right' }}>
				{t('gifts.sync_price')}
			</Button>
			<GiftsTable data={data} setData={setData} total={total} setFormData={setFormData} />
		</div>
	);
};

export default Gifts;
