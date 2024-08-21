import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataProducts } from '../ProductsTable/ProductsTable';
import { Button, Checkbox, Form, Input, InputNumber, Modal, message } from 'antd';
import './EditProduct.scss';
import {
	InputProductPanelUpdateArgs,
	RegionCodeEnumType,
	useGetPricesForBundleLazyQuery,
	useGetPricesForPackageLazyQuery,
	usePanelProductQuery,
	usePanelProductUpdateMutation,
} from '@generated/client-panel/graphql/types';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { Prices } from '../ProductsHeader/ProductsHeader';
import { ApolloError } from '@apollo/client';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

type Props = {
	isEditOpen: boolean;
	setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
	id: number | undefined;
	setData: React.Dispatch<React.SetStateAction<DataProducts>>;
};
const EditProduct = ({ isEditOpen, id, setIsEditOpen, setData }: Props) => {
	const [identifier, setIdentifier] = useState<number | null>(null);
	const [isBundle, setIsBundle] = useState<boolean>();
	const [autoSync, setAutoSync] = useState<RegionCodeEnumType[]>([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();
	const { t } = useTranslation();
	const [form] = useForm();
	const { data: productById, loading } = usePanelProductQuery({
		variables: { productId: id! },
		fetchPolicy: 'network-only',
	});

	const [getPricesForBundle, { loading: loadingBundle }] = useGetPricesForBundleLazyQuery();
	const [getPricesForPackage, { loading: loadingPackage }] = useGetPricesForPackageLazyQuery();
	const [updateProduct, { loading: loadingUpdate }] = usePanelProductUpdateMutation();
	useEffect(() => {
		if (!productById?.panelProduct) return;
		const { identifier, isBundle, autoSync } = productById.panelProduct;
		setIdentifier(identifier);
		setIsBundle(isBundle);
		setAutoSync(autoSync);
		if (autoSync.length === Object.values(RegionCodeEnumType).length) setSelectAllChecked(true);
	}, [productById]);

	const updateRegionPrices = (prices: Prices) => {
		const newValues = {};

		prices.forEach((item) => {
			newValues[`price_${item.region}`] = item.price;
		});
		Object.values(RegionCodeEnumType).forEach((region) => {
			if (!newValues[`price_${region}`]) {
				newValues[`price_${region}`] = null;
			}
		});

		form.setFieldsValue(newValues);
	};

	const getPrices = async () => {
		if (isBundle && identifier) {
			const { data, error } = await getPricesForBundle({ variables: { bundleId: identifier } });
			if (data?.panelProductSteamBundleInfo) {
				updateRegionPrices(data?.panelProductSteamBundleInfo.prices);
				if (!form.getFieldValue('name')) {
					form.setFieldValue('name', data.panelProductSteamBundleInfo.name);
				}
			}
			if (error) {
				return messageApi.open({
					type: 'error',
					content: error.message,
				});
			}
		} else {
			const { data, error } = await getPricesForPackage({ variables: { packageId: identifier! } });
			if (data?.panelProductSteamPackageInfo) {
				updateRegionPrices(data?.panelProductSteamPackageInfo.prices);
				if (!form.getFieldValue('name')) {
					form.setFieldValue('name', data.panelProductSteamPackageInfo.name);
				}
			}
			if (error) {
				return messageApi.open({
					type: 'error',
					content: error.message,
				});
			}
		}
	};

	const handleCheckboxChange = (region: RegionCodeEnumType, checked: boolean) => {
		if (checked) {
			setAutoSync([...autoSync, region]);
		} else {
			setAutoSync(autoSync.filter((item) => item !== region));
		}
	};

	const updateObject = (updatedObject: DataProducts[0]) => {
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
			const fieldsData = form.getFieldsValue();
			await form.validateFields();
			const pricesData = Object.values(RegionCodeEnumType)
				.map((region) => ({
					region,
					price: fieldsData[`price_${region}`],
				}))
				.filter((item) => typeof item?.price === 'number');

			const { identifier, name, isBundle } = fieldsData;

			const args = {
				prices: pricesData,
				autoSync,
				identifier,
				name,
				isBundle,
			};

			const { data } = await updateProduct({ variables: { productId: id!, args }, fetchPolicy: 'no-cache' });

			if (data?.panelProductUpdate) {
				updateObject(data.panelProductUpdate);
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

	const handleSelectAll = (e: CheckboxChangeEvent) => {
		const checked = e.target.checked;
		setSelectAllChecked(checked);
		if (checked) {
			setAutoSync(Object.values(RegionCodeEnumType));
		} else {
			setAutoSync([]);
		}
	};

	return (
		<>
			{contextHolder}
			<Modal
				title={t('products.edit')}
				key={`editmodal${id}`}
				open={isEditOpen}
				onOk={handleOk}
				onCancel={() => setIsEditOpen(false)}
				confirmLoading={loadingUpdate}
				footer={[
					<Button key="cancel" onClick={() => setIsEditOpen(false)}>
						{t('proxy.create.back')}
					</Button>,
					<Button type="primary" key={'confirmEdit'} onClick={handleOk} loading={loadingUpdate}>
						{t('bots.edit.confirm')}
					</Button>,
				]}
			>
				{loading ? (
					<LoadingOutlined />
				) : (
					<Form form={form} layout="vertical" className="proxy__form form-proxy" autoComplete="off">
						<div className="products__wrap-identifier">
							<Form.Item<InputProductPanelUpdateArgs>
								label={t('products.create.id')}
								name="identifier"
								className="form-proxy__item identifier"
								rules={[{ required: true, message: t('error_validation') }]}
								normalize={(value) => (value === '' ? null : value)}
								initialValue={productById?.panelProduct?.identifier}
							>
								<InputNumber controls={false} onChange={(value: number | null) => setIdentifier(value)} />
							</Form.Item>
							<Form.Item
								label={t('products.create.bundle')}
								className="form-proxy__item"
								name="isBundle"
								valuePropName="checked"
								initialValue={productById?.panelProduct?.isBundle}
							>
								<Checkbox
									onChange={(e) => {
										setIsBundle(e.target.checked);
									}}
								/>
							</Form.Item>
							<Button
								type="primary"
								disabled={identifier ? false : true}
								onClick={() => getPrices()}
								loading={loadingBundle || loadingPackage ? true : false}
							>
								{t('products.create.get_price')}
							</Button>
						</div>
						<Form.Item<InputProductPanelUpdateArgs>
							label={t('products.create.name')}
							name="name"
							className="form-proxy__item"
							rules={[{ required: true, message: t('error_validation') }]}
							initialValue={productById?.panelProduct?.name}
						>
							<Input />
						</Form.Item>

						<div className="products__region-identifier">
							<div className="products__region-label-wrap">
								<span>{t('products.create.regions')}</span>
								<span className="products__region-label-wrap_auto">{t('products.create.auto')}</span>
								<Checkbox checked={autoSync.length === Object.values(RegionCodeEnumType).length} onChange={handleSelectAll}>
									Выбрать все
								</Checkbox>
							</div>
							{Object.values(RegionCodeEnumType).map((region, index) => {
								const initPrice = productById?.panelProduct?.prices.find((el) => el.region === region)?.price;
								const initChecked = productById?.panelProduct?.autoSync.includes(region);
								return (
									<div className="products__wrap-price" key={index}>
										<Form.Item
											name={`price_${region}`}
											initialValue={initPrice}
											normalize={(value) => (value === '' ? null : value)}
										>
											<InputNumber controls={false} addonBefore={region} />
										</Form.Item>
										<Checkbox
											defaultChecked={initChecked}
											onChange={(e) => handleCheckboxChange(region, e.target.checked)}
											className="products__wrap-price_checkbox"
											checked={autoSync.includes(region)}
										/>
									</div>
								);
							})}
						</div>
					</Form>
				)}
			</Modal>
		</>
	);
};

export default EditProduct;
