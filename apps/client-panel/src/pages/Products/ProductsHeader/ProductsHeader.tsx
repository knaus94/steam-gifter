import { ApolloError } from '@apollo/client';
import {
	GetPricesForBundleQuery,
	InputProductPanelCreateArgs,
	usePanelProductCreateMutation,
	usePanelProductForceUpdatePricesMutation,
} from '@generated/client-panel/graphql/types';
import { tuple } from '@libs/core/common';
import { Button, Checkbox, Form, InputNumber, Modal, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import client from 'apps/client-panel/src/apolloClient';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductsData } from '../Products';
import './ProductsHeader.scss';

export type Prices = GetPricesForBundleQuery['panelProductSteamBundleInfo']['prices'];
type Props = {
	setData: React.Dispatch<React.SetStateAction<ProductsData>>;
};
const ProductsHeader = ({ setData }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [updatePrices, { loading: updateLoading }] = usePanelProductForceUpdatePricesMutation();

	const [messageApi, contextHolder] = message.useMessage();
	const { t } = useTranslation();
	const [form] = useForm();
	const showModal = () => {
		setIsModalOpen(true);
	};

	const [createProduct, { loading: loadingCreate }] = usePanelProductCreateMutation();

	const handleOk = async () => {
		try {
			const fieldsData = form.getFieldsValue();
			await form.validateFields();

			const { identifier, name, isBundle } = fieldsData;
			const args = {
				identifier,
				isBundle,
			};

			const { data } = await createProduct({ variables: { args }, fetchPolicy: 'no-cache' });

			if (data?.panelProductCreate) {
				setData((prev) => {
					return [data?.panelProductCreate, ...prev];
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

	const updatePricesHandle = async () => {
		const [res, resError] = await tuple(updatePrices({ fetchPolicy: 'network-only', errorPolicy: 'none' }));
		const err = resError ?? res.errors?.[0];
		if (err) {
			return messageApi.open({
				type: 'error',
				content: err.message,
			});
		}

		return messageApi.open({
			type: 'success',
			content: t('price_updated_sended'),
		});
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields();
	};

	return (
		<div className="products__header">
			{contextHolder}
			<Button type="primary" onClick={showModal} style={{ marginRight: '10px' }}>
				{t('products.create.title')}
			</Button>

			<Button type="primary" onClick={() => updatePricesHandle()} loading={updateLoading} style={{ float: 'right' }}>
				{t('products.force_price_update')}
			</Button>

			<Modal
				title={t('products.create.title')}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				confirmLoading={loadingCreate}
				footer={[
					<Button key="back" onClick={handleCancel}>
						{t('proxy.create.back')}
					</Button>,
					<Button key="submit" type="primary" onClick={handleOk} loading={loadingCreate}>
						{t('proxy.create.create')}
					</Button>,
				]}
			>
				<Form form={form} layout="vertical" className="proxy__form form-proxy" autoComplete="off">
					<div className="products__wrap-identifier">
						<Form.Item<InputProductPanelCreateArgs>
							label={t('products.create.id')}
							name="identifier"
							className="form-proxy__item identifier"
							rules={[{ required: true, message: t('error_validation') }]}
							normalize={(value) => (value === '' ? null : value)}
						>
							<InputNumber controls={false} />
						</Form.Item>
						<Form.Item
							label={t('products.create.bundle')}
							className="form-proxy__item"
							name="isBundle"
							valuePropName="checked"
							initialValue={false}
						>
							<Checkbox />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default ProductsHeader;
