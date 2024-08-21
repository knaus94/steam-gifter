import { ApolloError } from '@apollo/client';
import { InputBotPanelUpdateArgs, usePanelBotQuery, usePanelBotUpdateMutation } from '@generated/client-panel/graphql/types';
import { Button, Modal, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataBots } from '../Bots';
import './EditBot.scss';
import EditBotData from './EditBotData/EditBotData';
import { Nullable } from '@libs/core/common';
import { ParseBotInfo } from '../BotsMainAction/BotsMainAction';

type Props = {
	isEditOpen: boolean;
	setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
	id: number | undefined;
	setData: React.Dispatch<React.SetStateAction<DataBots>>;
};
const EditBot = ({ isEditOpen, setIsEditOpen, id, setData }: Props) => {
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const [infoBot, setInfoBot] = useState<Nullable<ParseBotInfo>>(null);

	const [form] = useForm();
	const { data: botById, loading } = usePanelBotQuery({
		variables: { panelBotId: id! },
		fetchPolicy: 'network-only',
	});
	const [editBot, { loading: editLoading }] = usePanelBotUpdateMutation();

	const updateObject = (updatedObject: DataBots[0]) => {
		setData((prevData) => {
			return prevData.map((item) => {
				if (item.id === updatedObject.id) {
					return updatedObject;
				}
				return item;
			});
		});
	};

	const handleOk = async () => {
		try {
			const fieldValue: InputBotPanelUpdateArgs = form.getFieldsValue();
			await form.validateFields();

			const args = {
				...fieldValue,
				avatarUrl: infoBot?.avatarUrl ? infoBot?.avatarUrl : null,
			};

			const { data } = await editBot({ variables: { panelBotUpdateId: id!, args: args } });
			if (data) {
				updateObject(data.panelBotUpdate);
			}
			form.resetFields();
			setIsEditOpen(false);
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
		<>
			{contextHolder}
			<Modal
				title={t('bots.edit.title')}
				key={`editmodal${id}`}
				open={isEditOpen}
				onOk={handleOk}
				onCancel={() => setIsEditOpen(false)}
				confirmLoading={editLoading}
				footer={[
					<Button key="cancel" onClick={() => setIsEditOpen(false)}>
						{t('proxy.create.back')}
					</Button>,
					<Button type="primary" key={'confirmEdit'} onClick={handleOk} loading={editLoading}>
						{t('bots.edit.confirm')}
					</Button>,
				]}
			>
				<EditBotData form={form} data={botById?.panelBot} loading={loading} infoBot={infoBot!} setInfoBot={setInfoBot} />
			</Modal>
		</>
	);
};

export default EditBot;
