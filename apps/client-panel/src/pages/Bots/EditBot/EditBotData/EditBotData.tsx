import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import {
	InputBotPanelUpdateArgs,
	InputProxyPanelArgs,
	PanelBotQuery,
	ProxyPanelSortByEnumType,
	RegionCodeEnumType,
	SortEnumType,
	useGetPanelProxiesLazyQuery,
	useParseBotInfoLazyQuery,
} from '@generated/client-panel/graphql/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './EditBotData.scss';

import { FormInstance } from 'antd/es/form/Form';

import { Button, Form, Input, Select, message } from 'antd';

import { Nullable } from '@libs/core/common';
import { ParseBotInfo } from '../../BotsMainAction/BotsMainAction';
import debounce from 'lodash.debounce';
import { generateProxyName } from 'apps/client-panel/src/utils/generateProxyName';
import { Data } from '../../../Proxy/Proxy';

type Props = {
	form: FormInstance;
	loading: boolean;
	data: PanelBotQuery['panelBot'];
	infoBot: Nullable<ParseBotInfo>;
	setInfoBot: React.Dispatch<React.SetStateAction<Nullable<ParseBotInfo>>>;
};
const EditBotData = ({ form, loading, data, infoBot, setInfoBot }: Props) => {
	const [proxy, setProxy] = useState<Data>([]);
	const [total, setTotal] = useState(0);
	const [isInitialRender, setIsInitialRender] = useState(true);
	const [messageApi, contextHolder] = message.useMessage();
	const [steamId, setSteamId] = useState<Nullable<string>>(null);
	const [accountName, setAccountName] = useState<Nullable<string>>(null);

	const [parceInfo, { loading: parseLoading }] = useParseBotInfoLazyQuery({ fetchPolicy: 'no-cache' });

	const { t } = useTranslation();
	const { Option } = Select;
	const [formData, setFormData] = useState<InputProxyPanelArgs>({
		take: 10,
		skip: 0,
		address: null,
		isValid: true,
		sort: {
			field: ProxyPanelSortByEnumType.Id,
			type: SortEnumType.Desc,
		},
	});

	useEffect(() => {
		if (!isInitialRender) {
			(async () => {
				const { data } = await getPanelProxies({
					variables: {
						args: formData,
					},
					fetchPolicy: 'no-cache',
				});
				if (data) {
					setProxy((prev) => [...prev, ...data.panelProxies.records]);
					setTotal(data.panelProxies.total);
				}
			})();
		} else {
			setIsInitialRender(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	const [getPanelProxies] = useGetPanelProxiesLazyQuery();

	const getProxy = async () => {
		if (proxy.length > 0) return;
		const { data } = await getPanelProxies({
			variables: {
				args: formData,
			},
			fetchPolicy: 'no-cache',
		});

		if (data) {
			setProxy(data.panelProxies.records);
			setTotal(data.panelProxies.total);
		}
	};

	const debouncedFunction = debounce((e: string) => {
		setProxy([]);
		setFormData((prev) => ({ ...prev, take: 10, skip: 0, address: e }));
	}, 350);

	const getBotInfo = async () => {
		if (!steamId) return;
		form.resetFields();
		form.setFieldsValue({ steamId64: steamId });
		const { data } = await parceInfo({ variables: { steamId64: steamId } });
		if (!data?.panelParseBotInfo.accountName) {
			return messageApi.open({
				type: 'error',
				content: t('bots.create.error'),
			});
		}
		setInfoBot(data?.panelParseBotInfo);
		form.setFieldsValue({ accountName: data.panelParseBotInfo.accountName });
	};

	const updateAccountName = () => {
		if (infoBot?.accountName) {
			form.setFieldValue('accountName', infoBot?.accountName);
		} else if (data) {
			setSteamId(data.steamId64);
			setAccountName(data.accountName);
		}
	};

	useEffect(() => {
		updateAccountName();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [infoBot, data]);

	return loading ? (
		<LoadingOutlined />
	) : (
		<>
			{contextHolder}

			<Form form={form} layout="vertical" className="edit-bot">
				<div className="form-bots__parce-wrap">
					<Form.Item<InputBotPanelUpdateArgs>
						label={`${t('bots.view.steam_id')}:`}
						initialValue={data?.steamId64}
						name={'steamId64'}
						rules={[{ required: true, message: t('error_validation') }]}
						className="form-bots__item"
					>
						<Input onChange={(e) => (e.target.value ? setSteamId(e.target.value) : setSteamId(null))} />
					</Form.Item>

					<Button type="primary" disabled={steamId ? false : true} onClick={() => getBotInfo()} loading={parseLoading}>
						{t('bots.create.parce')}
					</Button>
				</div>
				<Form.Item<InputBotPanelUpdateArgs>
					label={t('bots.create.avatar')}
					className="form-bots__item"
					rules={[{ required: true, message: t('error_validation') }]}
				>
					{infoBot?.avatarUrl ? (
						<img className="form-bots__img" src={infoBot.avatarUrl} alt="" />
					) : data?.avatarUrl ? (
						<img className="form-bots__img" src={data.avatarUrl} alt="" />
					) : (
						<div className="form-bots__default-img"></div>
					)}
				</Form.Item>
				<Form.Item<InputBotPanelUpdateArgs>
					label={`${t('bots.view.login')}:`}
					initialValue={data?.login}
					name={'login'}
					rules={[{ required: true, message: t('error_validation') }]}
				>
					<Input />
				</Form.Item>

				{accountName && (
					<Form.Item<InputBotPanelUpdateArgs>
						label={`${t('bots.view.username')}:`}
						initialValue={accountName}
						name={'accountName'}
						rules={[{ required: true, message: t('error_validation') }]}
					>
						<Input value={accountName} disabled />
					</Form.Item>
				)}

				<Form.Item<InputBotPanelUpdateArgs>
					label={`${t('bots.view.pass')}:`}
					initialValue={data?.password}
					name={'password'}
					rules={[{ required: true, message: t('error_validation') }]}
				>
					<Input.Password autoComplete="false" />
				</Form.Item>

				<Form.Item<InputBotPanelUpdateArgs>
					label={`${t('bots.view.key')}:`}
					initialValue={data?.sharedSecret}
					name={'sharedSecret'}
					rules={[{ required: true, message: t('error_validation') }]}
				>
					<Input.Password autoComplete="false" />
				</Form.Item>

				<Form.Item<InputBotPanelUpdateArgs>
					label={`${t('bots.view.region')}:`}
					name="region"
					className="form-bots__item"
					rules={[{ required: true, message: t('error_validation') }]}
					initialValue={data?.region}
				>
					<Select>
						{Object.values(RegionCodeEnumType).map((el) => {
							return (
								<Option key={el} value={el}>
									{el}
								</Option>
							);
						})}
					</Select>
				</Form.Item>
				<Form.Item<InputBotPanelUpdateArgs>
					label={`${t('bots.create.proxy_id')}:`}
					name="proxyId"
					className=""
					initialValue={data?.proxy ? generateProxyName(data?.proxy) : null}
				>
					<Select
						onClick={() => getProxy()}
						showSearch
						filterOption={false}
						onSearch={(e) => debouncedFunction(e)}
						onPopupScroll={(e) => {
							e.persist();
							const target = e.target as HTMLElement;
							if (formData.skip > total) return;
							if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
								setFormData((prev) => ({ ...prev, skip: prev.skip + 10 }));
							}
						}}
					>
						{proxy.map((el) => {
							return (
								<Option key={el.id} value={el.id}>
									{generateProxyName(el)}
								</Option>
							);
						})}
					</Select>
				</Form.Item>
			</Form>
		</>
	);
};

export default EditBotData;
