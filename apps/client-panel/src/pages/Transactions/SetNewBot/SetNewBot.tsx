import React, { useEffect, useState } from 'react';
import './SetNewBot.scss';

import { Button, Form, Select, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { DataBots } from '../../Bots/Bots';
import {
	BotPanelSortEnumType,
	InputBotPanelArgs,
	InputTransactionPanelArgs,
	SortEnumType,
	usePanelBotsLazyQuery,
	usePanelTransactionChangeBotMutation,
} from '@generated/client-panel/graphql/types';
import debounce from 'lodash.debounce';
import { ApolloError } from '@apollo/client';

type Props = {
	botId?: number;
	transactionId: number | undefined;
	setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
	setFormDataMain: React.Dispatch<React.SetStateAction<InputTransactionPanelArgs>>;
};

const SetNewBot = ({ botId, transactionId, setRefetch, setFormDataMain }: Props) => {
	const [bots, setBots] = useState<DataBots>([]);
	const [total, setTotal] = useState(0);

	const [formData, setFormData] = useState<InputBotPanelArgs>({
		take: 10,
		skip: 0,
		steamId64: null,
		login: null,
		status: null,
		sort: {
			field: BotPanelSortEnumType.Id,
			type: SortEnumType.Desc,
		},
	});

	const { Option } = Select;
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const [getBots] = usePanelBotsLazyQuery({ fetchPolicy: 'no-cache' });
	const [changeBot] = usePanelTransactionChangeBotMutation();
	// const [getInfo] = usePanelTransactionLazyQuery();

	const getBotsData = async () => {
		if (bots.length > 0) return;

		const { data } = await getBots({
			variables: {
				args: formData,
			},
			fetchPolicy: 'no-cache',
		});

		if (data) {
			setBots(data.panelBots.records);
			setTotal(data.panelBots.total);
		}
	};

	useEffect(() => {
		(async () => {
			const { data } = await getBots({
				variables: {
					args: formData,
				},
				fetchPolicy: 'no-cache',
			});
			if (data) {
				setBots((prev) => [...prev, ...data.panelBots.records]);
				setTotal(data.panelBots.total);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	const debouncedFunction = debounce((e: string) => {
		setBots([]);
		setFormData((prev) => ({ ...prev, take: 10, skip: 0, login: e }));
	}, 350);

	const handleFinish = async (data: { botId: number }) => {
		try {
			await changeBot({
				variables: { botId: data.botId, transactionId: transactionId! },
			});
			setRefetch(true);
			setFormDataMain((prev) => ({ ...prev, take: 10 }));
			return messageApi.open({
				type: 'success',
				content: t('transaction.success_bot'),
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
	return (
		<Form style={{ width: '200px' }} layout="vertical" onFinish={handleFinish}>
			{contextHolder}
			<Form.Item name={'botId'} className="gifts__create-form_product" rules={[{ required: true, message: t('error_validation') }]}>
				<Select
					onClick={() => getBotsData()}
					showSearch
					filterOption={false}
					onSearch={(e) => debouncedFunction(e)}
					placeholder={t('transaction.choose_bot')}
					onPopupScroll={(e) => {
						e.persist();
						const target = e.target as HTMLElement;
						if (formData.take > total) return;
						if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
							setFormData((prev) => ({ ...prev, skip: prev.skip + 10 }));
						}
					}}
				>
					{bots.map((el) => {
						const isSelected = el.id === botId;
						return (
							<Option key={`products${el.id}`} value={el.id} disabled={isSelected}>
								{el.login}
							</Option>
						);
					})}
				</Select>
			</Form.Item>

			<Button type="primary" htmlType="submit">
				{t('buttons.save')}
			</Button>
		</Form>
	);
};

export default SetNewBot;
