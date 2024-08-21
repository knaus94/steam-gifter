import {
	GetPanelProxiesQuery,
	InputProxyPanelArgs,
	ProxyPanelSortByEnumType,
	SortEnumType,
	usePanelDeleteProxyMutation,
} from '@generated/client-panel/graphql/types';
import { Button, Popconfirm, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { SortOrder } from 'antd/es/table/interface';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Data } from '../Proxy';
import './ProxyTable.scss';
import { ApolloError } from '@apollo/client';
import { DeleteOutlined } from '@ant-design/icons';
type DataType = GetPanelProxiesQuery['panelProxies']['records'][0];
type Props = {
	data: Data;
	setData: React.Dispatch<React.SetStateAction<Data>>;
	total: GetPanelProxiesQuery['panelProxies']['total'];
	formData: InputProxyPanelArgs;
	setFormData: React.Dispatch<React.SetStateAction<InputProxyPanelArgs>>;
};
export interface Sorter {
	column?: {
		key: string;
	};
	order?: SortOrder;
}
const ProxyTable = ({ data, setData, total, setFormData, formData }: Props) => {
	const [page, setPage] = useState<number | undefined>(undefined);

	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const [deleteProxy] = usePanelDeleteProxyMutation();

	const handleDelete = async (id: number) => {
		try {
			await deleteProxy({ variables: { proxyId: id } });

			setFormData((prev) => {
				return { ...prev, skip: 0, take: 10 };
			});
		} catch (error) {
			if (error instanceof ApolloError) {
				return messageApi.open({
					type: 'error',
					content: error.message,
				});
			}
		}
	};

	const columns: ColumnsType<DataType> = [
		{
			title: () => <span>{t('proxy.create.id')}</span>,
			key: ProxyPanelSortByEnumType.Id,
			dataIndex: 'id',
			className: 'column_1',
			sorter: true,
			showSorterTooltip: false,
			render: (id: DataType['id']) => {
				return <span>{id}</span>;
			},
		},
		{
			title: () => <span>{t('proxy.create.address')}</span>,
			key: 'address',
			dataIndex: 'address',
			className: 'column_1',
			render: (address: DataType['address']) => {
				return <span>{address}</span>;
			},
		},
		{
			title: () => <span>{t('proxy.create.port')}</span>,
			key: 'port',
			dataIndex: 'port',
			className: 'column_2',
			render: (port: DataType['port']) => {
				return <span>{port}</span>;
			},
		},

		{
			title: () => <span>{t('proxy.create.username')}</span>,
			key: 'username',
			dataIndex: 'username',
			className: 'column_3',
			render: (username: DataType['username']) => {
				return <span>{username ? username : '-'}</span>;
			},
		},
		{
			title: () => <span>{t('proxy.create.password')}</span>,
			key: 'password',
			dataIndex: 'password',
			className: 'column_4',
			render: (password: DataType['password']) => {
				return <span>{password ? password : '-'}</span>;
			},
		},
		{
			title: () => <span>{t('proxy.create.counts_bot')}</span>,
			key: ProxyPanelSortByEnumType.Bots,
			dataIndex: 'countBots',
			sorter: true,
			showSorterTooltip: false,
			className: 'column_4',
			render: (countBots: DataType['countBots']) => {
				return <span>{countBots ? countBots : '0'}</span>;
			},
		},
		{
			title: () => <span>{t('proxy.create.status')}</span>,
			key: 'action',
			dataIndex: 'isValid',
			className: 'column_4',
			render: (isValid: DataType['isValid']) => {
				 
				return isValid ? <div className="proxy__valid"></div> : <div className="proxy__no-valid"></div>;
			},
		},
		{
			title: () => <span>{t('proxy.create.actions')}</span>,
			key: 'action',
			dataIndex: 'id',
			className: 'column_4',
			render: (id: DataType['id']) => {
				return (
					<span>
						<Popconfirm
							title={t('proxy.delete.confirm_delete')}
							okText={t('proxy.delete.yes')}
							cancelText={t('proxy.delete.no')}
							onConfirm={() => handleDelete(id)}
							okType="danger"
						>
							<Button danger type="primary" icon={<DeleteOutlined />} />
						</Popconfirm>
					</span>
				);
			},
		},
	];
	return (
		<>
			{contextHolder}
			<Table
				className="proxy-table"
				columns={columns}
				dataSource={data}
				rowKey="id"
				pagination={{
					showSizeChanger: true,
					current: page,
					onShowSizeChange(_, size) {
						setData((prev) => prev.slice(0, size));
					},
					pageSizeOptions: [5, 10, 15, 20],
					total: total,
					locale: {
						items_per_page: `${t('proxy.pagination')}`,
					},
					onChange(page, pageSize) {
						setPage(page);
						setFormData((prev) => ({
							...prev,
							take: pageSize,
							skip: pageSize * (page - 1),
						}));
					},
				}}
				//@ts-ignore
				onChange={(_pagination, _filters, sorter: Sorter) => {
					if (sorter && sorter.column && sorter.order) {
						const { column, order } = sorter;

						setFormData((prev) => ({
							...prev,
							sort: {
								field: column.key as ProxyPanelSortByEnumType,
								type: order === 'descend' ? SortEnumType.Desc : SortEnumType.Asc,
							},
						}));
					}
				}}
			/>
		</>
	);
};

export default ProxyTable;
