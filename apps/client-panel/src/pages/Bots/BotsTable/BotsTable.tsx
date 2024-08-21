import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './BotsTable.scss';
import { Button, Drawer, Dropdown, Input, InputRef, MenuProps, Modal, Space, Table, Tag, Tooltip } from 'antd';
import { ReactComponent as TooltipIcon } from '../../../images/tooltip.svg';
import { CloseOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';

import {
	BotPanelSortEnumType,
	BotStatusEnumType,
	InputBotPanelArgs,
	PanelBotsQuery,
	SortEnumType,
	useDeleteBotMutation,
	usePanelBotRestartMutation,
	usePanelBotStartMutation,
	usePanelBotStopMutation,
} from '@generated/client-panel/graphql/types';
import { ColumnType, ColumnsType } from 'antd/es/table';
import { DataBots } from '../Bots';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { Sorter } from '../../Proxy/ProxyTable/ProxyTable';
import ViewBot from '../ViewBot/ViewBot';
import EditBot from '../EditBot/EditBot';
import { generateProxyName } from 'apps/client-panel/src/utils/generateProxyName';
type DataTypeBots = PanelBotsQuery['panelBots']['records'][0];

interface DataType {
	steamId64: string;
	status: BotStatusEnumType;
	login: string;
	id: number;
	balance: number;
}

type DataIndex = keyof DataType;

type Props = {
	data: DataBots;
	setData: React.Dispatch<React.SetStateAction<DataBots>>;
	total: number;
	setFormData: React.Dispatch<React.SetStateAction<InputBotPanelArgs>>;
};

const BotsTable = ({ data, setData, total, setFormData }: Props) => {
	const [page, setPage] = useState<number | undefined>(undefined);
	const [selectedBot, setSelectedBot] = useState<DataTypeBots>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [open, setOpen] = useState(false);

	const searchInput = useRef<InputRef>(null);

	const { t } = useTranslation();

	const [startBot] = usePanelBotStartMutation();
	const [stopBot] = usePanelBotStopMutation();
	const [deleteBot, { loading }] = useDeleteBotMutation();
	const [restartBot] = usePanelBotRestartMutation();

	const items: MenuProps['items'] = [
		selectedBot?.status === BotStatusEnumType.Error || selectedBot?.status === BotStatusEnumType.Stopped
			? {
					key: 'start',
					label: <Button>{t('bots.actions.start')}</Button>,
					onClick: () => startBot({ variables: { botId: selectedBot.id } }),
			  }
			: selectedBot?.status === BotStatusEnumType.Starting
			? null
			: {
					key: 'stop',
					label: <Button>{t('bots.actions.stop')}</Button>,
					onClick: () => stopBot({ variables: { botId: selectedBot!.id } }),
			  },
		selectedBot?.status === BotStatusEnumType.Running
			? {
					key: '3',
					label: <Button>{t('bots.actions.restart')}</Button>,
					onClick: () => restartBot({ variables: { botId: selectedBot.id } }),
			  }
			: null,
		{
			type: 'divider',
		},
		{
			key: '4',
			label: <Button type="primary">{t('bots.actions.edit')}</Button>,
			onClick: () => setIsEditOpen(true),
		},
		{
			key: '6',
			label: <Button style={{ backgroundColor: 'red', color: '#fff' }}>{t('bots.actions.delete')}</Button>,
			onClick: () => setIsModalOpen(true),
		},
	];

	const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
		confirm();
		if (!selectedKeys[0]) return;
		if (dataIndex === 'steamId64') {
			return setFormData((prev) => ({ ...prev, steamId64: selectedKeys[0]?.trim(), login: null }));
		}
		setFormData((prev) => ({ ...prev, login: selectedKeys[0]?.trim(), steamId64: null }));
	};

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setFormData((prev) => ({ ...prev, steamId64: null, login: null }));
	};

	const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
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

		render: (text) => <span>{text}</span>,
	});

	const columns: ColumnsType<DataTypeBots> = [
		{
			title: () => <span>{t('bots.table.id')}</span>,
			key: BotPanelSortEnumType.Id,
			dataIndex: 'id',
			className: 'column_1',
			sorter: true,
			render: (id: DataTypeBots['id']) => {
				return <span>{id}</span>;
			},
		},
		{
			title: () => <span>{t('bots.table.steam')}</span>,
			key: 'steamId64',
			dataIndex: 'steamId64',
			className: 'column_5',
			...getColumnSearchProps('steamId64'),
		},
		{
			title: () => <span>{t('bots.table.login')}</span>,
			key: 'login',
			dataIndex: 'login',
			className: 'column_2',
			...getColumnSearchProps('login'),
		},
		{
			title: () => <span>{t('bots.table.balance')}</span>,
			key: 'balance',
			dataIndex: 'balance',
			className: 'column_3',
			render: (balance: DataTypeBots['balance']) => {
				return <span>{balance}</span>;
			},
		},

		{
			title: () => <span>{t('bots.table.proxy')}</span>,
			key: 'proxy',
			dataIndex: 'proxy',
			className: 'column_4',
			render: (proxy: DataTypeBots['proxy']) => {
				let path = '';
				if (proxy) {
					path = generateProxyName(proxy);
				}

				return <span>{proxy ? path : '-'}</span>;
			},
		},

		{
			title: () => <span>{t('bots.table.status')}</span>,
			key: 'status',
			filters: Object.values(BotStatusEnumType).map((el) => ({ text: t(`bots.status.${el.toLowerCase()}`), value: el })),
			filterMultiple: false,
			className: 'column_6',
			render: (record: DataTypeBots) => {
				const { status } = record;
				const colorTag = status === BotStatusEnumType.Error || status === BotStatusEnumType.Stopped ? 'red' : 'green';
				return (
					<>
						<Tag color={colorTag} key={status}>
							{t(`bots.status.${status.toLowerCase()}`)}
						</Tag>
						{status === BotStatusEnumType.Error && (
							<Tooltip
								title={() => (
									<div className="bots__tooltip">
										<span className="bots__tooltip-title">{t(`bots.errors.${record.errCode?.toLowerCase()}`)}</span>
										<span className="bots__tooltip-text">{record.errMsg}</span>
									</div>
								)}
							>
								<TooltipIcon />
							</Tooltip>
						)}
					</>
				);
			},
		},
		{
			title: () => <span>{t('proxy.create.actions')}</span>,
			key: 'action',
			className: 'column_4',
			render: (record: DataTypeBots) => {
				return (
					<span>
						<Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
							<Button onClick={() => setSelectedBot(record)}>{t('proxy.create.actions')}</Button>
						</Dropdown>
						<Button
							type="primary"
							onClick={() => {
								setSelectedBot(record);
								showDrawer();
							}}
							style={{ marginLeft: '15px' }}
							icon={<EyeOutlined />}
						/>
					</span>
				);
			},
		},
	];

	const handleOk = async () => {
		await deleteBot({ variables: { deleteBotId: selectedBot!.id } });
		setFormData((prev) => ({ ...prev, take: 10 }));
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Modal
				title={t('bots.delete.title')}
				key="deleteModal"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={() => handleCancel()}
				confirmLoading={loading}
				footer={[
					<Button key="back" onClick={() => handleCancel()}>
						{t('proxy.create.back')}
					</Button>,
					<Button
						type="default"
						key="confirmDelete"
						style={{ backgroundColor: 'red', color: '#fff' }}
						loading={loading}
						onClick={handleOk}
					>
						{t('bots.delete.btn')}
					</Button>,
				]}
			>
				<span className="bots__delete">{t('bots.delete.text', { name: selectedBot?.login })}</span>
			</Modal>

			<Drawer title={t('bots.view.title')} key="viewDrawer" placement="right" onClose={onClose} open={open} width={500} destroyOnClose>
				<ViewBot id={selectedBot?.id} />
			</Drawer>
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
				//@ts-ignore
				onChange={(_pagination, _filters, sorter: Sorter) => {
					if (sorter && sorter.column && sorter.order) {
						const { column, order } = sorter;

						setFormData((prev) => ({
							...prev,
							sort: {
								field: column.key as BotPanelSortEnumType,
								type: order === 'descend' ? SortEnumType.Desc : SortEnumType.Asc,
							},
						}));
					}

					if (_filters.status) {
						const status = _filters.status[0] ? (_filters.status[0] as BotStatusEnumType) : null;
						return setFormData((prev) => ({ ...prev, status }));
					}
					setFormData((prev) => ({ ...prev, status: null }));
				}}
			/>

			{isEditOpen && <EditBot isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} id={selectedBot?.id} setData={setData} />}
		</>
	);
};

export default BotsTable;
