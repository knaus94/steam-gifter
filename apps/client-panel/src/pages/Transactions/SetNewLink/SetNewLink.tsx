import React from 'react';

import { Button, Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { usePanelTransactionUpdateProfileLinkMutation } from '@generated/client-panel/graphql/types';

import { ApolloError } from '@apollo/client';
import './SetNewLink.scss';

type Props = {
	transactionId: number | undefined;
	setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
};

const SetNewLink = ({ transactionId, setRefetch }: Props) => {
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();
	const [updateLink, { loading: updateLoading }] = usePanelTransactionUpdateProfileLinkMutation();

	const handleFinish = async (data: { profileLink: string }) => {
		try {
			await updateLink({ variables: { profileLink: data.profileLink, transactionId: transactionId! } });
			setRefetch(true);
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
			<Form.Item name={'profileLink'} className="gifts__create-form_product" rules={[{ required: true, message: t('error_validation') }]}>
				<Input className="newLink-input" />
			</Form.Item>

			<Button type="primary" htmlType="submit" loading={updateLoading}>
				{t('buttons.save')}
			</Button>
		</Form>
	);
};

export default SetNewLink;
