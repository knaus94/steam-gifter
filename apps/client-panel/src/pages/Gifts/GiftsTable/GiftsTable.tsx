import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	DigisellerProductPanelSortEnumType,
	GetGiftsQuery,
	InputDigisellerProductPanelArgs,
	SortEnumType,
	useDeleteGiftMutation,
} from '@generated/client-panel/graphql/types';
import { Button, Input, InputRef, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { GiftsData } from '../Gifts';
import { ColumnType, ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { LangEnum, Nullable } from '@libs/core/common';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { CloseOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import './GiftsTable.scss';
import { useNavigate } from 'react-router-dom';
import { take } from 'rxjs';

type DataTypeGifts = GetGiftsQuery['panelDigisellerProducts']['records'][0];

type DataTypeSearch = {
	digisellerId: number;
	name: Partial<Record<LangEnum, Nullable<string>>>;
};

type Props = {
	data: GiftsData;
	setData: React.Dispatch<React.SetStateAction<GiftsData>>;
	total: number;
	setFormData: React.Dispatch<React.SetStateAction<InputDigisellerProductPanelArgs>>;
};
const GiftsTable = ({ data, total, setData, setFormData }: Props) => {
	const [page, setPage] = useState<number | undefined>(undefined);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const searchInput = useRef<InputRef>(null);

	const [deleteGift, { loading: deleteLoading }] = useDeleteGiftMutation();

	const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: keyof DataTypeSearch) => {
		confirm();
		if (!selectedKeys[0]) return;
		if (dataIndex === 'digisellerId') {
			return setFormData((prev) => ({ ...prev, digisellerId: +selectedKeys[0]?.trim(), name: null }));
		}
		setFormData((prev) => ({ ...prev, name: selectedKeys[0]?.trim(), digisellerId: null }));
	};

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setFormData((prev) => ({ ...prev, name: null, digisellerId: null }));
	};

	const getColumnSearchProps = (dataIndex: keyof DataTypeSearch): ColumnType<DataTypeGifts> => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
		render: (text: DataTypeSearch) => {
			if (typeof text === 'number') {
				return <span>{text}</span>;
			}

			return Object.values(LangEnum).map((el) => {
				return (
					<p key={el}>
						<Typography.Text strong>{el}: </Typography.Text>
						<span>{text[el]}</span>{' '}
					</p>
				);
			});
		},
	});

	const columns: ColumnsType<DataTypeGifts> = [
		{
			title: () => <span>{t('gifts.table.id')}</span>,
			key: DigisellerProductPanelSortEnumType.Id,
			dataIndex: 'id',
			className: 'column_1',
			sorter: true,
			render: (id: DataTypeGifts['id']) => {
				return <span>{id}</span>;
			},
		},
		{
			title: () => <span>{t('gifts.table.avatar')}</span>,
			key: 'avatar',
			className: 'column_2',
			render: (record: DataTypeGifts) => {
				if (record.previewUrl) {
					return <img src={`${record.previewUrl}`} alt={record.previewUrl} className="gifts-table__img" />;
				}
				return <div className="gifts-table__default-img"></div>;
			},
		},
		{
			title: () => <span>{t('gifts.table.name')}</span>,
			key: 'name',
			dataIndex: 'name',
			className: 'column_3',
			...getColumnSearchProps('name'),
		},
		{
			title: () => <span>{t('gifts.table.digi')}</span>,
			key: 'digisellerId',
			dataIndex: 'digisellerId',
			className: 'column_3',
			...getColumnSearchProps('digisellerId'),
		},
		{
			title: () => <span>{t('gifts.table.created')}</span>,
			key: DigisellerProductPanelSortEnumType.CreatedAt,
			sorter: true,
			dataIndex: 'createdAt',
			className: 'column_4',
			render: (createdAt: DataTypeGifts['createdAt']) => {
				const formattedTime = moment(createdAt).locale(i18n.language).format('HH:mm:ss');
				const formattedDate = moment(createdAt).locale(i18n.language).format('ll');
				return <span>{`${formattedTime} ${formattedDate}`}</span>;
			},
		},
		{
			title: () => <span>{t('gifts.table.updated')}</span>,
			key: DigisellerProductPanelSortEnumType.UpdatedAt,
			sorter: true,
			dataIndex: 'updatedAt',
			className: 'column_5',
			render: (updatedAt: DataTypeGifts['updatedAt']) => {
				const formattedTime = moment(updatedAt).locale(i18n.language).format('HH:mm:ss');
				const formattedDate = moment(updatedAt).locale(i18n.language).format('ll');
				return <span>{`${formattedTime} ${formattedDate}`}</span>;
			},
		},
		{
			title: () => <span>{t('gifts.table.status')}</span>,
			key: 'status',
			dataIndex: 'isDisabled',
			filters: [true, false].map((value) => ({
				text: t(`gifts.table.${value.toString()}`),
				value: value,
			})),
			filterMultiple: false,
			className: 'column_6',
			render: (isDisabled: DataTypeGifts['isDisabled']) => {
				const colorTag = isDisabled ? 'red' : 'green';
				return <Tag color={colorTag}>{t(`gifts.table.${isDisabled.toString()}`)}</Tag>;
			},
		},
		{
			title: () => <span>{t('gifts.table.actions')}</span>,
			key: 'actions',
			className: 'column_6',
			render: (record: DataTypeGifts) => {
				return (
					<Space>
						<Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/gifts/edit/${record.id}`)} />
						<Popconfirm
							title={t('proxy.delete.confirm_delete')}
							okText={t('proxy.delete.yes')}
							cancelText={t('proxy.delete.no')}
							onConfirm={async () => {
								await deleteGift({ variables: { digisellerProductDeleteId: record.id } });
								setFormData((prev) => ({ ...prev, take: 10 }));
							}}
							okType="danger"
						>
							<Button danger type="primary" icon={<DeleteOutlined />} />
						</Popconfirm>
					</Space>
				);
			},
		},
	];

	return (
		<Table
			className="gifts-table"
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
							field: column.key as DigisellerProductPanelSortEnumType,
							type: order === 'descend' ? SortEnumType.Desc : SortEnumType.Asc,
						},
					}));
				}

				if (_filters.status) {
					const isDisabled = _filters.status[0] ? (_filters.status[0] as boolean) : false;
					return setFormData((prev) => ({ ...prev, isDisabled }));
				}
				setFormData((prev) => ({ ...prev, isDisabled: null }));
			}}
		/>
	);
};

export default GiftsTable;
