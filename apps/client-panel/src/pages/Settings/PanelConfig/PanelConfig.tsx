import React from 'react';
import { useTranslation } from 'react-i18next';
import './PanelConfig.scss';
import { InputConfigPanelUpdateArgs, usePanelConfigQuery, usePanelConfigUpdateMutation } from '@generated/client-panel/graphql/types';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { ApolloError } from '@apollo/client';

const PanelConfig = () => {
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const { data, loading } = usePanelConfigQuery({ fetchPolicy: 'no-cache' });
	const [update] = usePanelConfigUpdateMutation();

	const handleSubmit = async (_data: InputConfigPanelUpdateArgs) => {
		try {
			await update({ variables: { args: _data } });
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
		<div className="panel-config">
			{contextHolder}
			<Form className="panel-config__form" layout="vertical" onFinish={(data: InputConfigPanelUpdateArgs) => handleSubmit(data)}>
				<Form.Item
					name="telegramLogin"
					normalize={(value) => (value.trim() === '' ? null : value)}
					label={t('settings.config_data.telegram')}
					initialValue={data?.panelConfig.telegramLogin}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="discordLink"
					label={t('settings.config_data.discord')}
					normalize={(value) => (value.trim() === '' ? null : value)}
					initialValue={data?.panelConfig.discordLink}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="email"
					normalize={(value) => (value.trim() === '' ? null : value)}
					label={t('settings.config_data.email')}
					initialValue={data?.panelConfig.email}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="skypeLink"
					normalize={(value) => (value.trim() === '' ? null : value)}
					label={t('settings.config_data.skype')}
					initialValue={data?.panelConfig.skypeLink}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="supportLink"
					normalize={(value) => (value.trim() === '' ? null : value)}
					label={t('settings.config_data.support')}
					initialValue={data?.panelConfig.supportLink}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="vkLink"
					normalize={(value) => (value.trim() === '' ? null : value)}
					label={t('settings.config_data.vk')}
					initialValue={data?.panelConfig.vkLink}
				>
					<Input />
				</Form.Item>
				<Button type="primary" htmlType="submit">
					{t('save')}
				</Button>
			</Form>
		</div>
	);
};

export default PanelConfig;
