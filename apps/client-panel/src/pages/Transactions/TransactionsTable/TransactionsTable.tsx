import React, { useRef, useState } from 'react';

import './TransactionsTable.scss';
import { DataTransactions } from '../Transactions';
import {
	GetPanelTransactionsQuery,
	InputTransactionPanelArgs,
	PanelTransactionStatusStreamSubscription,
	SortEnumType,
	TransactionPanelSortEnumType,
	TransactionStatusEnumType,
} from '@generated/client-panel/graphql/types';
import { useTranslation } from 'react-i18next';
import Table, { ColumnType, ColumnsType } from 'antd/es/table';
import { Button, Input, InputRef, Modal, Space, Tag } from 'antd';
import moment from 'moment';
import { CloseOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import ViewTransaction from '../ViewTransaction/ViewTransaction';
import { FilterConfirmProps } from 'antd/es/table/interface';

type DataTypeTransaction = GetPanelTransactionsQuery['panelTransactions']['records'][0];
type Props = {
	data: DataTransactions;
	setData: React.Dispatch<React.SetStateAction<DataTransactions>>;
	total: number;
	setFormData: React.Dispatch<React.SetStateAction<InputTransactionPanelArgs>>;
	subData: PanelTransactionStatusStreamSubscription | undefined;
};
type DataIndex = keyof DataTypeTransaction['paymentDetails'];

const TransactionsTable = ({ data, setData, setFormData, total, subData }: Props) => {
	const [page, setPage] = useState<number | undefined>(undefined);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<number>();

	const { t, i18n } = useTranslation();
	const searchInput = useRef<InputRef>(null);
	const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void) => {
		confirm();
		if (!selectedKeys[0]) return;
		setFormData((prev) => ({ ...prev, uniqCode: selectedKeys[0]?.trim() }));
	};
	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setFormData((prev) => ({ ...prev, uniqCode: null }));
	};
	const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataTypeTransaction> => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys as string[], confirm)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						{t('bots.search')}
					</Button>
					<Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						{t('bots.reset')}
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						<CloseOutlined />
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,

		render: (record: DataTypeTransaction) => (
			<Space>
				<span>{record.paymentDetails.uniqCode}</span>
			</Space>
		),
	});

	const columns: ColumnsType<DataTypeTransaction> = [
		{
			title: () => <span>{t('transaction.table.id')}</span>,
			key: TransactionPanelSortEnumType.Id,
			dataIndex: 'id',
			className: 'column_1',
			sorter: true,
			render: (id: DataTypeTransaction['id']) => {
				return <span>{id}</span>;
			},
		},
		{
			title: () => <span>{t('transaction.table.uniq_code')}</span>,
			key: 'uniqCode',
			className: 'column_1',
			...getColumnSearchProps('uniqCode'),
		},
		{
			title: () => <span>{t('transaction.table.status')}</span>,
			key: 'status',
			filters: Object.values(TransactionStatusEnumType).map((el) => ({ text: t(`transaction.status.${el.toLowerCase()}`), value: el })),
			filterMultiple: false,
			className: 'column_1',
			render: (record: DataTypeTransaction) => {
				const { status } = record;
				const color =
					status !== TransactionStatusEnumType.Error && status !== TransactionStatusEnumType.Success
						? 'default'
						: status.toLowerCase();

				return (
					<Tag color={color} key={status}>
						{t(`transaction.status.${status.toLowerCase()}`)}
					</Tag>
				);
			},
		},
		{
			title: () => <span>{t('transaction.table.gift')}</span>,
			key: TransactionPanelSortEnumType.Status,
			className: 'column_1',
			render: (record: DataTypeTransaction) => {
				const name = record.edition.product.name;
				const editionName = record.edition.name;
				return <p>{editionName ? `${name} (${editionName})` : `${name}`}</p>;
			},
		},
		{
			title: () => <span>{t('transaction.table.bot')}</span>,
			key: 'status',
			className: 'column_1',
			render: (record: DataTypeTransaction) => {
				return <p>{record.bot?.login ?? ''}</p>;
			},
		},
		{
			title: () => <span>{t('transaction.table.created')}</span>,
			key: TransactionPanelSortEnumType.CreatedA,
			sorter: true,
			className: 'column_1',
			render: (record: DataTypeTransaction) => {
				const formattedTime = moment(record.createdAt).locale(i18n.language).format('HH:mm:ss ll');
				return <p>{formattedTime}</p>;
			},
		},
		{
			title: () => <span>{t('transaction.table.updated')}</span>,
			key: TransactionPanelSortEnumType.UpdatedAt,
			sorter: true,
			className: 'column_1',
			render: (record: DataTypeTransaction) => {
				const formattedTime = moment(record.updatedAt).locale(i18n.language).format('HH:mm:ss ll');
				return <p>{formattedTime}</p>;
			},
		},
		{
			title: () => <span>{t('transaction.table.actions')}</span>,
			key: 'status',
			className: 'column_1',
			render: (record: DataTypeTransaction) => {
				return (
					<Button
						type="primary"
						icon={<EyeOutlined />}
						onClick={() => {
							setSelectedTransaction(record.id);
							setIsModalOpen(true);
						}}
					/>
				);
			},
		},
	];

	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<Modal
				title={t('transaction.title')}
				key="transactionModal"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={() => handleCancel()}
				className="transaction-modal"
				destroyOnClose
				footer={[
					<Button key="back" onClick={() => handleCancel()}>
						{t('buttons.back')}
					</Button>,
				]}
			>
				<ViewTransaction id={selectedTransaction!} setFormData={setFormData} subData={subData} />
			</Modal>
			<Table
				className="transactions-table"
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
								field: column.key as TransactionPanelSortEnumType,
								type: order === 'descend' ? SortEnumType.Desc : SortEnumType.Asc,
							},
						}));
					}

					if (_filters.status) {
						const status = _filters.status[0] ? (_filters.status[0] as TransactionStatusEnumType) : null;
						return setFormData((prev) => ({ ...prev, status }));
					}
					setFormData((prev) => ({ ...prev, status: null }));
				}}
			/>
		</>
	);
};

export default TransactionsTable;
