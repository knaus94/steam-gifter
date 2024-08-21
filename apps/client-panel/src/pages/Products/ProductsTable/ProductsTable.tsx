import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ProductsTable.scss';
import {
	InputProductPanelArgs,
	PanelProductsQuery,
	ProductPanelSortEnumType,
	SortEnumType,
	usePanelProductDeleteMutation,
} from '@generated/client-panel/graphql/types';
import { Button, Dropdown, Input, InputRef, MenuProps, Modal, Popconfirm, Popover, Space, Tag } from 'antd';
import Table, { ColumnType, ColumnsType } from 'antd/es/table';
import { CloseOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { FilterConfirmProps } from 'antd/es/table/interface';
import EditProduct from '../EditProduct/EditProduct';

type DataTypeProducts = PanelProductsQuery['panelProducts']['records'][0];
export type DataProducts = PanelProductsQuery['panelProducts']['records'];

type Props = {
	data: DataProducts;
	setData: React.Dispatch<React.SetStateAction<DataProducts>>;
	total: number;
	setFormData: React.Dispatch<React.SetStateAction<InputProductPanelArgs>>;
};

type DataIndex = keyof DataTypeProducts;

const ProductsTable = ({ data, setData, setFormData, total }: Props) => {
	const [page, setPage] = useState<number | undefined>(undefined);
	const [selectedProduct, setSelectedProduct] = useState<DataTypeProducts>();

	const [isEditOpen, setIsEditOpen] = useState(false);
	const searchInput = useRef<InputRef>(null);
	const { t } = useTranslation();

	const [productDelete] = usePanelProductDeleteMutation();

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setFormData((prev) => ({ ...prev, name: null }));
	};

	const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void) => {
		confirm();
		if (!selectedKeys[0]) return;
		setFormData((prev) => ({ ...prev, name: selectedKeys[0]?.trim() }));
	};

	const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataTypeProducts> => ({
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

		render: (record: DataTypeProducts) => (
			<Space>
				<span>{record.name}</span>
				{record.isBundle && <Tag>{t('products.create.bundle')}</Tag>}
			</Space>
		),
	});

	const columns: ColumnsType<DataTypeProducts> = [
		{
			title: () => <span>{t('bots.table.id')}</span>,
			key: ProductPanelSortEnumType.Id,
			dataIndex: 'id',
			className: 'column_1',
			sorter: true,
			render: (id: DataTypeProducts['id']) => {
				return <span>{id}</span>;
			},
		},
		{
			title: () => <span>{t('products.create.name')}</span>,
			key: 'name',
			className: 'column_5',
			...getColumnSearchProps('name'),
		},
		{
			title: () => <span>{t('products.create.id')}</span>,
			key: 'identifier',
			dataIndex: 'identifier',
			className: 'column_2',
			render: (identifier: DataTypeProducts['identifier']) => {
				return <span>{identifier}</span>;
			},
		},
		{
			title: () => <span>{t('products.create.synk')}</span>,
			key: 'autoSync',
			dataIndex: 'autoSync',
			className: 'column_3',
			render: (autoSync: DataTypeProducts['autoSync']) => {
				return autoSync.length
					? autoSync.map((el) => {
							return <Tag key={el}>{el}</Tag>;
					  })
					: '-';
			},
		},
		{
			title: () => <span>{t('products.create.prices')}</span>,
			key: 'prices',
			dataIndex: 'prices',
			className: 'column_3',
			render: (prices: DataTypeProducts['prices']) => {
				const content = (
					<div>
						{prices.map((el) => {
							return <p key={el.region}>{`${el.region}: ${el.price}`}</p>;
						})}
					</div>
				);
				return (
					<Popover placement="right" title={t('products.create.prices')} content={content} trigger="hover">
						<Button>···</Button>
					</Popover>
				);
			},
		},
		{
			title: () => <span>{t('proxy.create.actions')}</span>,
			key: 'action',
			className: 'column_4',
			render: (record: DataTypeProducts) => {
				return (
					<Space>
						<Button
							type="primary"
							icon={<EditOutlined />}
							onClick={() => {
								setSelectedProduct(record);
								setIsEditOpen(true);
							}}
						/>
						<Popconfirm
							title={t('proxy.delete.confirm_delete')}
							okText={t('proxy.delete.yes')}
							cancelText={t('proxy.delete.no')}
							onConfirm={async () => {
								await productDelete({ variables: { productId: selectedProduct!.id } });
								setFormData((prev) => ({ ...prev, take: 10 }));
							}}
							okType="danger"
						>
							<Button danger type="primary" icon={<DeleteOutlined />} onClick={() => setSelectedProduct(record)} />
						</Popconfirm>
					</Space>
				);
			},
		},
	];

	return (
		<>
			<Table
				className="bots-table"
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
				// @ts-ignore
				onChange={(_pagination, _filters, sorter: Sorter) => {
					if (sorter && sorter.column && sorter.order) {
						const { column, order } = sorter;

						setFormData((prev) => ({
							...prev,
							sort: {
								field: column.key as ProductPanelSortEnumType,
								type: order === 'descend' ? SortEnumType.Desc : SortEnumType.Asc,
							},
						}));
					}
				}}
			/>
			{isEditOpen && <EditProduct isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} id={selectedProduct?.id} setData={setData} />}
		</>
	);
};

export default ProductsTable;
