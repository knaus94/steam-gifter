import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Form, Input, InputNumber, message } from 'antd';
import Modal from 'antd/es/modal/Modal';
import './ProxyHeader.scss';
import { useForm } from 'antd/es/form/Form';
import { InputProxyPanelArgs, InputProxyPanelCreateArgs, usePanelCreateProxyMutation } from '@generated/client-panel/graphql/types';
import { ApolloError } from '@apollo/client';
import { SearchProps } from 'antd/es/input/Search';
import { Data } from '../Proxy';
type Props = {
	setFormData: React.Dispatch<React.SetStateAction<InputProxyPanelArgs>>;
	setData: React.Dispatch<React.SetStateAction<Data>>;
};

const ProxyHeader = ({ setFormData, setData }: Props) => {
	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = useForm();
	const { Search } = Input;
	const [messageApi, contextHolder] = message.useMessage();

	const [createProxy, { loading }] = usePanelCreateProxyMutation();
	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = async () => {
		try {
			const fieldValue = form.getFieldsValue();
			await form.validateFields();
			const { data } = await createProxy({ variables: { args: fieldValue }, fetchPolicy: 'no-cache' });
			if (data) {
				setData((prev) => {
					return [data.panelCreateProxy, ...prev];
				});
			}

			form.resetFields();
			setIsModalOpen(false);
		} catch (error) {
			if (error instanceof ApolloError) {
				return messageApi.open({
					type: 'error',
					content: error.message,
				});
			}
		}
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields();
	};
	const onSearch: SearchProps['onSearch'] = (value) => setFormData((prev) => ({ ...prev, address: value.trim() }));

	return (
		<div className="proxy__header">
			{contextHolder}
			<Button type="primary" onClick={showModal}>
				{t('proxy.create.title')}
			</Button>
			<Search placeholder={t('proxy.create.search')} allowClear onSearch={onSearch} style={{ width: 200 }} />
			<Modal
				title={t('proxy.create.title')}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				confirmLoading={loading}
				footer={[
					<Button key="back" onClick={handleCancel}>
						{t('proxy.create.back')}
					</Button>,
					<Button key="submit" type="primary" loading={loading} onClick={handleOk}>
						{t('proxy.create.create')}
					</Button>,
				]}
			>
				<Form form={form} layout="vertical" className="proxy__form form-proxy" autoComplete="off">
					<Form.Item<InputProxyPanelCreateArgs>
						label={t('proxy.create.address')}
						name="address"
						className="form-proxy__item"
						rules={[{ required: true, message: t('error_validation') }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<InputProxyPanelCreateArgs>
						label={t('proxy.create.port')}
						name="port"
						className="form-proxy__item"
						rules={[{ required: true, message: t('error_validation') }]}
					>
						<InputNumber controls={false} />
					</Form.Item>

					<Form.Item<InputProxyPanelCreateArgs> label={t('proxy.create.username')} name="username" className="form-proxy__item">
						<Input />
					</Form.Item>
					<Form.Item<InputProxyPanelCreateArgs> label={t('proxy.create.password')} name="password" className="form-proxy__item">
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ProxyHeader;
