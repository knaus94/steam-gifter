import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input, Modal, Popconfirm, Select, message } from 'antd';

import {
	InputBotPanelCreateArgs,
	InputProxyPanelArgs,
	ParseBotInfoQuery,
	ProxyPanelSortByEnumType,
	RegionCodeEnumType,
	SortEnumType,
	useGetPanelProxiesLazyQuery,
	usePanelBotCreateMutation,
	usePanelRestartAllBotsMutation,
	usePanelStartAllBotsMutation,
	usePanelStopAllBotsMutation,
	useParseBotInfoLazyQuery,
} from '@generated/client-panel/graphql/types';

import { useForm } from 'antd/es/form/Form';
import { ApolloError } from '@apollo/client';
import type { DataBots } from '../Bots';
import './BotsMainAction.scss';
import { Nullable } from '@libs/core/common';
import debounce from 'lodash.debounce';
import { Data } from '../../Proxy/Proxy';
import { generateProxyName } from 'apps/client-panel/src/utils/generateProxyName';

const { Option } = Select;

export type ParseBotInfo = ParseBotInfoQuery['panelParseBotInfo'];
type Props = {
	setData: React.Dispatch<React.SetStateAction<DataBots>>;
};

const BotsMainAction = ({ setData }: Props) => {
	const [messageApi, contextHolder] = message.useMessage();

	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = useForm();
	const showModal = () => {
		setIsModalOpen(true);
	};
	const [infoBot, setInfoBot] = useState<Nullable<ParseBotInfo>>();
	const [steamId, setSteamId] = useState<Nullable<string>>(null);
	const [parseInfo, { data, loading: parseLoading }] = useParseBotInfoLazyQuery({ fetchPolicy: 'no-cache' });
	const [createBot, { loading }] = usePanelBotCreateMutation();
	const [startAll] = usePanelStartAllBotsMutation();
	const [stopAll] = usePanelStopAllBotsMutation();
	const [restartAll] = usePanelRestartAllBotsMutation();
	const [proxy, setProxy] = useState<Data>([]);
	const [total, setTotal] = useState(0);

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

	const [getPanelProxies, { loading: isGetProxy }] = useGetPanelProxiesLazyQuery();
	const [isInitialRender, setIsInitialRender] = useState(true);

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

	const debouncedFunction = debounce((e: string) => {
		setProxy([]);
		setFormData((prev) => ({ ...prev, take: 10, skip: 0, address: e }));
	}, 350);

	const handleOk = async () => {
		try {
			const fieldValue = form.getFieldsValue();
			await form.validateFields();

			const { data } = await createBot({
				variables: {
					args: {
						...fieldValue,
						proxyId: +fieldValue.proxyId,
						avatarUrl: infoBot?.avatarUrl ? infoBot.avatarUrl : null,
					},
				},
				fetchPolicy: 'no-cache',
			});
			if (data) {
				setData((prev) => {
					return [data.panelBotCreate, ...prev];
				});
			}
			form.resetFields();
			setInfoBot(null);
			setSteamId(null);
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
		setSteamId(null);
		setInfoBot(null);
		form.resetFields();
	};

	const handleStartAll = async () => {
		try {
			await startAll();
		} catch (error) {
			if (error instanceof ApolloError) {
				return messageApi.open({
					type: 'error',
					content: error.message,
				});
			}
		}
	};
	const handleStopAll = async () => {
		try {
			await stopAll();
		} catch (error) {
			if (error instanceof ApolloError) {
				return messageApi.open({
					type: 'error',
					content: error.message,
				});
			}
		}
	};
	const handleRestartAll = async () => {
		try {
			await restartAll();
		} catch (error) {
			if (error instanceof ApolloError) {
				return messageApi.open({
					type: 'error',
					content: error.message,
				});
			}
		}
	};
	const getBotInfo = async () => {
		if (!steamId) return;
		form.resetFields();
		form.setFieldsValue({ steamId64: steamId });
		setInfoBot(null);
		const { data } = await parseInfo({ variables: { steamId64: steamId }, fetchPolicy: 'no-cache' });
		if (!data?.panelParseBotInfo.accountName) {
			return messageApi.open({
				type: 'error',
				content: t('bots.create.error'),
			});
		}
		setInfoBot(data.panelParseBotInfo);
		form.setFieldsValue({ accountName: data.panelParseBotInfo.accountName });
	};

	return (
		<div className="bots__buttons">
			{contextHolder}
			<Button type="primary" className="bots__buttons-create" onClick={showModal}>
				{t('bots.create.title')}
			</Button>
			<Popconfirm
				title={t('proxy.delete.confirm_delete')}
				okText={t('proxy.delete.yes')}
				cancelText={t('proxy.delete.no')}
				onConfirm={() => handleStartAll()}
				okType="danger"
			>
				<Button style={{ backgroundColor: 'green', color: '#fff' }}>{t('bots.buttons.start_all')}</Button>
			</Popconfirm>
			<Popconfirm
				title={t('proxy.delete.confirm_delete')}
				okText={t('proxy.delete.yes')}
				cancelText={t('proxy.delete.no')}
				onConfirm={() => handleStopAll()}
				okType="danger"
			>
				<Button style={{ backgroundColor: 'red' }} type="primary">
					{t('bots.buttons.stop_all')}
				</Button>
			</Popconfirm>
			<Popconfirm
				title={t('proxy.delete.confirm_delete')}
				okText={t('proxy.delete.yes')}
				cancelText={t('proxy.delete.no')}
				onConfirm={() => handleRestartAll()}
				okType="danger"
			>
				<Button>{t('bots.buttons.restart_all')}</Button>
			</Popconfirm>
			<Modal
				title={t('bots.create.title')}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				confirmLoading={loading}
				destroyOnClose={true}
				footer={[
					<Button key="back" onClick={handleCancel}>
						{t('proxy.create.back')}
					</Button>,
					infoBot && (
						<Button key="submit" type="primary" loading={loading} onClick={handleOk}>
							{t('proxy.create.create')}
						</Button>
					),
				]}
			>
				<Form form={form} layout="vertical" className="bots__form form-bots" autoComplete="off">
					<div className="form-bots__parce-wrap">
						<Form.Item<InputBotPanelCreateArgs>
							label={t('bots.create.steam_id')}
							name="steamId64"
							className="form-bots__item"
							rules={[{ required: true, message: t('error_validation') }]}
						>
							<Input onChange={(e) => (e.target.value ? setSteamId(e.target.value) : setSteamId(null))} value={steamId ?? ''} />
						</Form.Item>
						<Button type="primary" disabled={steamId ? false : true} onClick={() => getBotInfo()} loading={parseLoading}>
							{t('bots.create.parce')}
						</Button>
					</div>
					{infoBot && (
						<>
							<Form.Item<InputBotPanelCreateArgs>
								label={t('bots.create.avatar')}
								className="form-bots__item"
								rules={[{ required: true, message: t('error_validation') }]}
							>
								{infoBot.avatarUrl ? (
									<img className="form-bots__img" src={infoBot.avatarUrl} alt="" />
								) : (
									<div className="form-bots__default-img"></div>
								)}
							</Form.Item>
							<Form.Item<InputBotPanelCreateArgs>
								label={t('bots.create.account_name')}
								name="accountName"
								className="form-bots__item"
								rules={[{ required: true, message: t('error_validation') }]}
							>
								<Input disabled />
							</Form.Item>
							<Form.Item<InputBotPanelCreateArgs>
								label={t('bots.create.login')}
								name="login"
								className="form-bots__item"
								rules={[{ required: true, message: t('error_validation') }]}
							>
								<Input />
							</Form.Item>

							<Form.Item<InputBotPanelCreateArgs>
								label={t('bots.create.password')}
								name="password"
								className="form-bots__item"
								rules={[{ required: true, message: t('error_validation') }]}
							>
								<Input.Password autoComplete="false" />
							</Form.Item>

							<Form.Item<InputBotPanelCreateArgs> label={t('bots.create.proxy_id')} name="proxyId" className="form-bots__item">
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

							<Form.Item<InputBotPanelCreateArgs>
								label={t('bots.create.region')}
								name="region"
								className="form-bots__item"
								rules={[{ required: true, message: t('error_validation') }]}
							>
								<Select>
									{Object.values(RegionCodeEnumType).map((el) => {
										return <Option key={el}>{el}</Option>;
									})}
								</Select>
							</Form.Item>
							<Form.Item<InputBotPanelCreateArgs>
								label={t('bots.create.shared_secret')}
								name="sharedSecret"
								className="form-bots__item"
								rules={[{ required: true, message: t('error_validation') }]}
							>
								<Input.Password autoComplete="false" />
							</Form.Item>
						</>
					)}
				</Form>
			</Modal>
		</div>
	);
};

export default BotsMainAction;
