import { InfoCircleOutlined, LoadingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ApolloError } from '@apollo/client';
import {
	InputDigisellerConfigUpdatePanelArgs,
	MeDocument,
	MeQuery,
	usePanelDigisellerConfigQuery,
	usePanelDigisellerConfigUpdateMutation,
} from '@generated/client-panel/graphql/types';
import { LangEnum, coreConfig } from '@libs/core/common';
import { Button, Form, Input, InputNumber, Space, Tooltip, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Paragraph from 'antd/es/typography/Paragraph';
import client from 'apps/client-panel/src/apolloClient';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Digiseller.scss';

type TranslationData = keyof InputDigisellerConfigUpdatePanelArgs;
type FormData = Omit<InputDigisellerConfigUpdatePanelArgs, 'regions'>;

interface Data extends FormData {
	regions: { name: string }[];
}

const Digiseller = () => {
	const [formData, setFormData] = useState<FormData>({
		apiKey: null,
		editionSelectionFieldName: {},
		profileLinkFieldName: {},
		regionFieldName: {},
	});
	const { me } =
		client.readQuery<MeQuery>({
			query: MeDocument,
		}) || {};
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const [form] = useForm();

	const { data, loading } = usePanelDigisellerConfigQuery({ fetchPolicy: 'no-cache' });
	const [update] = usePanelDigisellerConfigUpdateMutation();

	useEffect(() => {
		if (!data) return;
		const { panelDigisellerConfig } = data;

		setFormData({
			apiKey: panelDigisellerConfig.apiKey ? panelDigisellerConfig.apiKey : '',
			editionSelectionFieldName: panelDigisellerConfig.editionSelectionFieldName,
			profileLinkFieldName: panelDigisellerConfig.profileLinkFieldName,
			regionFieldName: panelDigisellerConfig.regionFieldName,
		});

		const initialValue = panelDigisellerConfig.regions.map((el) => {
			return {
				name: el.name,
			};
		});
		form.setFieldsValue({ regions: initialValue });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const handleInputChange = (key: TranslationData, value: string | undefined, lang?: LangEnum) => {
		if (value?.trim() === '') value = undefined;
		if (key === 'editionSelectionFieldName' && lang) {
			return setFormData((prevData) => ({
				...prevData,
				editionSelectionFieldName: {
					...prevData.editionSelectionFieldName,
					[lang]: value,
				},
			}));
		}
		if (key === 'profileLinkFieldName' && lang) {
			return setFormData((prevData) => ({
				...prevData,
				profileLinkFieldName: {
					...prevData.profileLinkFieldName,
					[lang]: value,
				},
			}));
		}
		if (key === 'regionFieldName' && lang) {
			return setFormData((prevData) => ({
				...prevData,
				regionFieldName: {
					...prevData.regionFieldName,
					[lang]: value,
				},
			}));
		}
		setFormData((prevData) => ({
			...prevData,
			[key]: value,
		}));
	};

	const handleSubmit = async (_data: Data) => {
		const args = {
			...formData,
			regions: _data.regions.map((el) => el.name),
			sellerId: _data.sellerId,
		};

		if (args.regions.length < 1) {
			return messageApi.open({
				type: 'error',
				content: t('settings.digiseller_data.error'),
			});
		}
		try {
			await update({ variables: { args: args } });
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
		<div className="digiseller">
			{contextHolder}
			<Form form={form} className="digiseller__form" layout="vertical" onFinish={(data: Data) => handleSubmit(data)} autoComplete="false">
				<Form.Item label={t('settings.digiseller_data.supplier')} initialValue={data?.panelDigisellerConfig.sellerId} className="">
					<Paragraph copyable={{ tooltips: [t('copy'), t('copied')] }} className="digiseller__form__copy">
						{`${coreConfig.project.apiUrl}/digiseller `}
					</Paragraph>
				</Form.Item>
				<Form.Item name="sellerId" label={t('settings.digiseller_data.seller')} initialValue={data?.panelDigisellerConfig.sellerId}>
					<InputNumber controls={false} min={1} />
				</Form.Item>
				<Form.Item
					name="apiKey"
					normalize={(value) => (value.trim() === '' ? null : value)}
					label={t('settings.digiseller_data.api')}
					initialValue={data?.panelDigisellerConfig.apiKey}
				>
					<Input.Password name="api" autoComplete="false" onChange={(e) => handleInputChange('apiKey', e.target.value)} />
				</Form.Item>

				<Form.Item name="editionSelectionFieldName" label={t('settings.digiseller_data.edition')}>
					<div>
						{Object.values(LangEnum).map((el) => {
							return (
								<Form.Item key={`editionSelectionFieldName${el}`} normalize={(value) => (value.trim() === '' ? null : value)}>
									<Input
										addonBefore={el}
										value={formData.editionSelectionFieldName[el] ?? ''}
										onChange={(e) => handleInputChange('editionSelectionFieldName', e.target.value, el)}
									/>
								</Form.Item>
							);
						})}
					</div>
				</Form.Item>

				<Form.Item name="profileLinkFieldName" label={t('settings.digiseller_data.profile')}>
					<div>
						{Object.values(LangEnum).map((el) => {
							return (
								<Form.Item key={`profileLinkFieldName${el}`} normalize={(value) => (value.trim() === '' ? null : value)}>
									<Input
										addonBefore={el}
										value={formData.profileLinkFieldName[el] ?? ''}
										onChange={(e) => handleInputChange('profileLinkFieldName', e.target.value, el)}
									/>
								</Form.Item>
							);
						})}
					</div>
				</Form.Item>

				<Form.Item name="regionFieldName" label={t('settings.digiseller_data.region')}>
					<div>
						{Object.values(LangEnum).map((el) => {
							return (
								<Form.Item key={`regionFieldName${el}`} normalize={(value) => (value.trim() === '' ? null : value)}>
									<Input
										addonBefore={el}
										value={formData.regionFieldName[el] ?? ''}
										onChange={(e) => handleInputChange('regionFieldName', e.target.value, el)}
									/>
								</Form.Item>
							);
						})}
					</div>
				</Form.Item>
				<div className="digiseller__tooltip">
					<span className="digiseller__label">{t('settings.digiseller_data.regions')}</span>
					<Tooltip title={t('settings.tooltip')}>
						<InfoCircleOutlined />
					</Tooltip>
				</div>
				<Form.List name="regions">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }, index) => (
								<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
									<Form.Item
										{...restField}
										normalize={(value) => (value.trim() === '' ? null : value)}
										name={[name, 'name']}
										rules={[{ required: true, message: t('error_validation') }]}
									>
										<Input placeholder="Значение" />
									</Form.Item>
									<MinusCircleOutlined
										onClick={() => {
											remove(name);
										}}
									/>
								</Space>
							))}

							<Form.Item>
								<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
									{t('settings.digiseller_data.add')}
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Button type="primary" htmlType="submit">
					{t('save')}
				</Button>
			</Form>
		</div>
	);
};

export default Digiseller;
