import React, { useEffect, useState } from 'react';

import './ViewTransaction.scss';
import { Button, List, Modal, Popover, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
	InputPaginationArgs,
	InputTransactionPanelArgs,
	PanelTransactionLogsQuery,
	PanelTransactionStatusStreamSubscription,
	TransactionStatusEnumType,
	usePanelTransactionLazyQuery,
	usePanelTransactionLogsLazyQuery,
	usePanelTransactionUpdateProfileLinkMutation,
	useResetAttempMutation,
} from '@generated/client-panel/graphql/types';
import SetNewEvent from '../SetNewEvent/SetNewEvent';
import SetNewBot from '../SetNewBot/SetNewBot';
import moment from 'moment';
import LogsTable from '../LogsTable/LogsTable';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import SetNewLink from '../SetNewLink/SetNewLink';

export type DataLogs = PanelTransactionLogsQuery['panelTransactionLogs']['records'];
type Props = {
	id: number;
	setFormData: React.Dispatch<React.SetStateAction<InputTransactionPanelArgs>>;
	subData: PanelTransactionStatusStreamSubscription | undefined;
};

const ViewTransaction = ({ id, setFormData, subData }: Props) => {
	const [logsData, setLogsData] = useState<DataLogs>([]);
	const [countAttemp, setCountAttemp] = useState(false);
	const [total, setTotal] = useState(0);
	const [refetch, setRefetch] = useState(true);
	const { t, i18n } = useTranslation();

	const [argsLogs, setArgsLogs] = useState<InputPaginationArgs>({
		take: 5,
		skip: 0,
	});

	const [reset, { loading }] = useResetAttempMutation();
	useEffect(() => {
		if (subData && subData.PanelTransactionStatusStream.transaction.id === id) {
			const newLog = {
				createdAt: subData.PanelTransactionStatusStream.createdAt,
				errMsg: subData.PanelTransactionStatusStream.errMsg,
				event: subData.PanelTransactionStatusStream.event,
				id: subData.PanelTransactionStatusStream.id,
				status: subData.PanelTransactionStatusStream.status,
			};

			const newLogsData = [newLog, ...logsData];

			setLogsData(newLogsData);
			setTotal((prev) => prev + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subData]);

	const [getInfo, { data }] = usePanelTransactionLazyQuery();

	useEffect(() => {
		if (!refetch) return;
		(async () => {
			await getInfo({ variables: { transactionId: id }, fetchPolicy: 'no-cache' });
			setRefetch(false);
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetch]);

	const [getLogs] = usePanelTransactionLogsLazyQuery({ fetchPolicy: 'no-cache' });

	useEffect(() => {
		(async () => {
			const { data } = await getLogs({ variables: { transactionId: id, args: argsLogs } });
			if (data) {
				setLogsData(data.panelTransactionLogs.records);
				setTotal(data.panelTransactionLogs.total);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [argsLogs]);

	const handleReset = async () => {
		try {
			setCountAttemp(false);
			const { data } = await reset({ variables: { transactionId: id } });
			setCountAttemp(true);
		} catch (error) {}
	};

	return (
		<div className="view-transaction">
			<div className="view-transaction__buttons">
				<Popover
					content={
						<SetNewEvent id={id} currentStatus={logsData[0]?.status ?? data?.panelTransaction?.status} setRefetch={setRefetch} />
					}
					title={t('transaction.choose_status')}
					trigger="click"
					destroyTooltipOnHide
				>
					<Button type="primary" disabled={data?.panelTransaction?.status === TransactionStatusEnumType.Success}>
						{t('transaction.change_status')}
					</Button>
				</Popover>
				<Popover
					content={
						<SetNewBot
							setFormDataMain={setFormData}
							setRefetch={setRefetch}
							botId={data?.panelTransaction?.bot?.id}
							transactionId={data?.panelTransaction?.id}
						/>
					}
					title={t('transaction.choose_bot')}
					trigger="click"
					destroyTooltipOnHide
				>
					<Button type="primary" disabled={data?.panelTransaction?.status === TransactionStatusEnumType.Success}>
						{t('transaction.change_bot')}
					</Button>
				</Popover>
			</div>

			<List itemLayout="horizontal" bordered style={{ display: 'flex', justifyContent: 'flex-start' }}>
				<List.Item className="view-transaction__item">
					<Typography.Text strong>{t('transaction.event.info.id')}: </Typography.Text>
					<Typography.Text>{data?.panelTransaction?.id}</Typography.Text>
				</List.Item>
				<List.Item className="view-transaction__item">
					<Typography.Text strong>{t('transaction.event.info.steam_id')}: </Typography.Text>
					<Typography.Text>{data?.panelTransaction?.steamId64 ?? '-'}</Typography.Text>
				</List.Item>
				<List.Item className="view-transaction__item">
					<Typography.Text strong>{t('transaction.event.info.status')}: </Typography.Text>
					<Typography.Text>
						<Tag
							color={
								data?.panelTransaction?.status !== TransactionStatusEnumType.Error &&
								data?.panelTransaction?.status !== TransactionStatusEnumType.Success
									? 'default'
									: data?.panelTransaction?.status.toLowerCase()
							}
						>
							{subData?.PanelTransactionStatusStream.status
								? t(`transaction.status.${subData?.PanelTransactionStatusStream.status.toLowerCase()}`)
								: t(`transaction.status.${data?.panelTransaction?.status.toLowerCase()}`)}
						</Tag>
					</Typography.Text>
				</List.Item>
				<List.Item className="view-transaction__item">
					<Typography.Text strong>{t('transaction.event.info.region')}: </Typography.Text>
					<Typography.Text>{data?.panelTransaction?.region}</Typography.Text>
				</List.Item>
				<List.Item className="view-transaction__item attemp">
					<Typography.Text strong>{t('transaction.event.info.attemp')}: </Typography.Text>
					<Typography.Text style={!data?.panelTransaction?.sendAttempts ? { color: 'red' } : { color: 'black' }}>
						{countAttemp ? 3 : data?.panelTransaction?.sendAttempts}
					</Typography.Text>
					<Button type="primary" icon={<ReloadOutlined />} onClick={() => handleReset()} loading={loading} />
				</List.Item>
				<List.Item className="view-transaction__item">
					<Typography.Text strong>{t('transaction.event.info.invoice')}: </Typography.Text>
					<Typography.Text>{data?.panelTransaction?.paymentDetails.invoice}</Typography.Text>
				</List.Item>
				<List.Item className="view-transaction__item">
					<Typography.Text strong>{t('transaction.event.info.uniq_code')}: </Typography.Text>
					<Typography.Text>{data?.panelTransaction?.paymentDetails.uniqCode}</Typography.Text>
				</List.Item>
				<List.Item className="view-transaction__item attemp">
					<Typography.Text strong>{t('transaction.event.info.user_link')}: </Typography.Text>
					<Typography.Text>
						<a href={data?.panelTransaction?.profileLink} target="_blank" rel="noreferrer" className="view-transaction__text">
							{data?.panelTransaction?.profileLink}
						</a>
					</Typography.Text>
					<Popover
						content={<SetNewLink setRefetch={setRefetch} transactionId={data?.panelTransaction?.id} />}
						title={t('transaction.choose_link')}
						trigger="click"
						destroyTooltipOnHide
						style={{ width: 700 }}
					>
						<Button
							type="primary"
							disabled={data?.panelTransaction?.status !== TransactionStatusEnumType.Error}
							icon={<EditOutlined />}
						/>
					</Popover>
				</List.Item>
				<List.Item className="view-transaction__item">
					<Typography.Text strong>{t('transaction.event.info.bot')}: </Typography.Text>
					<Typography.Text>
						{data?.panelTransaction?.bot?.login} {` (${data?.panelTransaction?.bot?.steamId64})`}
					</Typography.Text>
				</List.Item>
				<List.Item className="view-transaction__item">
					<Typography.Text strong>{t('transaction.event.info.created')}: </Typography.Text>
					<Typography.Text>
						{moment(data?.panelTransaction?.createdAt)
							.locale(i18n.language)
							.format('HH:mm:ss ll')}
					</Typography.Text>
				</List.Item>
				<List.Item className="view-transaction__item">
					<Typography.Text strong>{t('transaction.event.info.updated')}: </Typography.Text>
					<Typography.Text>
						{moment(data?.panelTransaction?.updatedAt)
							.locale(i18n.language)
							.format('HH:mm:ss ll')}
					</Typography.Text>
				</List.Item>
			</List>

			<LogsTable logs={logsData} setLogs={setLogsData} total={total} setArgsLogs={setArgsLogs} />
		</div>
	);
};

export default ViewTransaction;
