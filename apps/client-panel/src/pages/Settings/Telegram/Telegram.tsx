import React, { useState } from 'react';
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Form, Input, InputNumber, Switch, message } from 'antd';
import { ApolloError } from '@apollo/client';

import './Telegram.scss';
import {
	InputTelegramPanelConfigUpdateArgs,
	usePanelTelegramConfigQuery,
	usePanelTelegramConfigUpdateMutation,
} from '@generated/client-panel/graphql/types';

const Telegram = () => {
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const [updateTelegram] = usePanelTelegramConfigUpdateMutation();

	const { data, loading } = usePanelTelegramConfigQuery({ fetchPolicy: 'no-cache' });

	const handleFinish = async (_data: InputTelegramPanelConfigUpdateArgs) => {
		try {
			await updateTelegram({ variables: { args: _data } });
			messageApi.open({
				type: 'success',
				content: t('settings.success'),
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
	return loading ? (
		<LoadingOutlined />
	) : (
		<div className="telegram">
			{contextHolder}
			<Form
				className="telegram__form"
				autoComplete="false"
				layout="vertical"
				onFinish={(data: InputTelegramPanelConfigUpdateArgs) => handleFinish(data)}
			>
				<Form.Item name={'botToken'} label={t('settings.telegram_data.token')} initialValue={data?.panelTelegramConfig.botToken}>
					<Input.Password autoComplete="false" style={{ width: '520px' }} />
				</Form.Item>

				<div className="telegram__left">
					<Divider orientation="left">{t('settings.telegram_data.first')}</Divider>
					<div className="telegram__left telegram__left-wrap">
						<Form.Item
							label={t('settings.telegram_data.chat')}
							name={'balanceChatId'}
							className="telegram__item"
							initialValue={data?.panelTelegramConfig.balanceChatId}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label={t('settings.telegram_data.threshold')}
							name={'balanceThreshold'}
							className="telegram__item"
							initialValue={data?.panelTelegramConfig.balanceThreshold}
						>
							<InputNumber className="telegram__input-number" controls={false} />
						</Form.Item>
						<Form.Item
							label={t('settings.telegram_data.notification')}
							className="telegram__item"
							name="balanceNotification"
							valuePropName="checked"
							initialValue={data?.panelTelegramConfig.balanceNotification}
						>
							<Switch />
						</Form.Item>
					</div>
				</div>
				<div className="telegram__right">
					<Divider orientation="left">{t('settings.telegram_data.second')}</Divider>
					<div className="telegram__right telegram__right-wrap">
						<Form.Item
							label={t('settings.telegram_data.chat')}
							name={'statusChangeChatId'}
							initialValue={data?.panelTelegramConfig.statusChangeChatId}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label={t('settings.telegram_data.notification')}
							className="telegram__item"
							name="statusChangeNotification"
							valuePropName="checked"
							initialValue={data?.panelTelegramConfig.statusChangeNotification}
						>
							<Switch />
						</Form.Item>
					</div>
				</div>
				<div className="telegram__right">
					<Divider orientation="left">{t('settings.telegram_data.price_id')}</Divider>
					<div className="telegram__right telegram__right-wrap">
						<Form.Item
							label={t('settings.telegram_data.chat')}
							name={'productPricesUpdatedChatId'}
							initialValue={data?.panelTelegramConfig.productPricesUpdatedChatId}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label={t('settings.telegram_data.notification')}
							className="telegram__item"
							name="productPricesUpdatedNotification"
							valuePropName="checked"
							initialValue={data?.panelTelegramConfig.productPricesUpdatedNotification}
						>
							<Switch />
						</Form.Item>
					</div>
				</div>

				<Button type="primary" htmlType="submit">
					{t('save')}
				</Button>
			</Form>
		</div>
	);
};

export default Telegram;
