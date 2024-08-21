import React, { useEffect, useState } from 'react';

import './Transactions.scss';
import {
	GetPanelTransactionsQuery,
	InputTransactionPanelArgs,
	SortEnumType,
	TransactionPanelSortEnumType,
	useGetPanelTransactionsLazyQuery,
	usePanelTransactionStatusStreamSubscription,
} from '@generated/client-panel/graphql/types';
import TransactionsTable from './TransactionsTable/TransactionsTable';

export type DataTransactions = GetPanelTransactionsQuery['panelTransactions']['records'];

const Transactions = () => {
	const [data, setData] = useState<DataTransactions>([]);
	const [total, setTotal] = useState(0);

	const [formData, setFormData] = useState<InputTransactionPanelArgs>({
		take: 10,
		skip: 0,
		id: null,
		invoice: null,
		status: null,
		uniqCode: null,
		sort: {
			field: TransactionPanelSortEnumType.Id,
			type: SortEnumType.Desc,
		},
	});

	const { data: subData } = usePanelTransactionStatusStreamSubscription();

	useEffect(() => {
		if (subData) {
			const newData = [...data];

			const index = newData.findIndex((item) => item.id === subData.PanelTransactionStatusStream.transaction.id);

			if (index !== -1) {
				newData[index] = {
					...newData[index],
					status: subData.PanelTransactionStatusStream.status,
					updatedAt: subData.PanelTransactionStatusStream.createdAt,
				};

				setData(newData);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subData]);

	const [getTransactions] = useGetPanelTransactionsLazyQuery();

	useEffect(() => {
		(async () => {
			const { data } = await getTransactions({
				variables: {
					args: formData,
				},
				fetchPolicy: 'no-cache',
			});
			if (data) {
				setData(data.panelTransactions.records);
				setTotal(data.panelTransactions.total);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	return <TransactionsTable data={data} setData={setData} setFormData={setFormData} total={total} subData={subData} />;
};

export default Transactions;
