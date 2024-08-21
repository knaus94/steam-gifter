import React, { useState } from 'react';

import type { DataLogs } from '../ViewTransaction/ViewTransaction';
import { InputPaginationArgs, PanelTransactionLogsQuery, TransactionStatusEnumType } from '@generated/client-panel/graphql/types';
import { Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { ReactComponent as TooltipIcon } from '../../../images/tooltip.svg';

import './LogsTable.scss';
import moment from 'moment';
type DataTypeLog = PanelTransactionLogsQuery['panelTransactionLogs']['records'][0];
type Props = {
	logs: DataLogs | undefined;
	total: number;
	setArgsLogs: React.Dispatch<React.SetStateAction<InputPaginationArgs>>;
	setLogs: React.Dispatch<React.SetStateAction<DataLogs>>;
};

const LogsTable = ({ logs, total, setArgsLogs, setLogs }: Props) => {
	const [page, setPage] = useState<number | undefined>(undefined);
	const { t, i18n } = useTranslation();
	const columns: ColumnsType<DataTypeLog> = [
		{
			title: () => <span>{t('transaction.table.id')}</span>,
			key: 'id',
			dataIndex: 'id',
			className: 'column_1',
			render: (id: DataTypeLog['id']) => {
				return <span>{id}</span>;
			},
		},
		{
			title: () => <span>{t('transaction.table.event')}</span>,
			key: 'event',
			className: 'column_2',
			render: (record: DataTypeLog) => {
				return <p>{record.event ? t(`transaction.event.${record.event?.toLowerCase()}`) : '-'}</p>;
			},
		},
		{
			title: () => <span>{t('transaction.table.status')}</span>,
			key: 'status',
			className: 'column_1',
			render: (record: DataTypeLog) => {
				const { status } = record;
				const message = record.errMsg;
				const color =
					status !== TransactionStatusEnumType.Error && status !== TransactionStatusEnumType.Success
						? 'default'
						: status.toLowerCase();

				return (
					<>
						<Tag color={color} key={status}>
							{t(`transaction.status.${status.toLowerCase()}`)}
						</Tag>
						{message && (
							<Tooltip
								title={() => (
									<div className="bots__tooltip">
										<span className="bots__tooltip-text">{message}</span>
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
			title: () => <span>{t('transaction.table.created')}</span>,
			key: 'created',
			className: 'column_1',
			render: (record: DataTypeLog) => {
				const formattedTime = moment(record.createdAt).locale(i18n.language).format('HH:mm:ss ll');
				return <p>{formattedTime}</p>;
			},
		},
	];
	return (
		<Table
			className="logs-table"
			columns={columns}
			dataSource={logs}
			rowKey={'id'}
			pagination={{
				showSizeChanger: true,
				current: page,
				onShowSizeChange(_, size) {
					setLogs((prev) => prev.slice(0, size));
				},
				pageSizeOptions: [5, 10, 15, 20],
				total: total,
				defaultPageSize: 5,
				locale: {
					items_per_page: `${t('proxy.pagination')}`,
				},
				onChange(page, pageSize) {
					setPage(page);
					setArgsLogs((prev) => ({
						...prev,
						take: pageSize,
						skip: pageSize * (page - 1),
					}));
				},
			}}
		/>
	);
};

export default LogsTable;
