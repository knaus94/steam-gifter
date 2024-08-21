import React from 'react';

import './SetNewEvent.scss';
import { Button, Form, Select, message } from 'antd';
import {
	TransactionEventEnumType,
	TransactionStatusEnumType,
	usePanelTransactionUpdateStatusMutation,
} from '@generated/client-panel/graphql/types';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

type Data = {
	newStatus: TransactionStatusEnumType;
	event?: TransactionEventEnumType;
};

type Props = {
	id: number;
	currentStatus: TransactionStatusEnumType | undefined;
	setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
};

const SetNewEvent = ({ id, currentStatus, setRefetch }: Props) => {
	const { Option } = Select;
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();
	const [changeStatus] = usePanelTransactionUpdateStatusMutation();

	const handleFinish = async (data: Data) => {
		try {
			await changeStatus({
				variables: {
					transactionId: id,
					args: {
						newStatus: data.newStatus,
						event: data.event ? data.event : null,
						currentStatus: currentStatus!,
					},
				},
			});
			setRefetch(true);
			return messageApi.open({
				type: 'success',
				content: t('transaction.success_status'),
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

	return (
		<Form style={{ width: '200px' }} layout="vertical" onFinish={handleFinish}>
			{contextHolder}
			<Form.Item label={t('transaction.event_label')} name={'event'}>
				<Select>
					{Object.values(TransactionEventEnumType).map((event) => {
						return (
							<Option key={event} value={event}>
								{t(`transaction.event.${event.toLowerCase()}`)}
							</Option>
						);
					})}
				</Select>
			</Form.Item>
			<Form.Item label={t('transaction.status.title')} name={'newStatus'} rules={[{ required: true, message: t('error_validation') }]}>
				<Select>
					{Object.values(TransactionStatusEnumType).map((status) => {
						return (
							<Option key={status} value={status}>
								{t(`transaction.status.${status.toLowerCase()}`)}
							</Option>
						);
					})}
				</Select>
			</Form.Item>
			<Button type="primary" htmlType="submit">
				{t('buttons.save')}
			</Button>
		</Form>
	);
};

export default SetNewEvent;
