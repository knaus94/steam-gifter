import React, { useEffect, useState } from 'react';
import './Bots.scss';
import BotsMainAction from './BotsMainAction/BotsMainAction';
import {
	BotPanelSortEnumType,
	InputBotPanelArgs,
	PanelBotsQuery,
	SortEnumType,
	useBotStatusStreamSubscription,
	usePanelBotsLazyQuery,
} from '@generated/client-panel/graphql/types';
import BotsTable from './BotsTable/BotsTable';

export type DataBots = PanelBotsQuery['panelBots']['records'];
const Bots = () => {
	const [data, setData] = useState<DataBots>([]);
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

	const { data: subData } = useBotStatusStreamSubscription();

	useEffect(() => {
		if (!subData) return;

		const dataIndex = data.findIndex((bot) => bot.id === subData.PanelBotStatusStream.botId);
		if (dataIndex !== -1) {
			const updatedBot = { ...data[dataIndex] };
			updatedBot.errCode = subData.PanelBotStatusStream.errCode;
			updatedBot.errMsg = subData.PanelBotStatusStream.errMsg;
			updatedBot.status = subData.PanelBotStatusStream.newStatus;

			const newData = [...data];
			newData[dataIndex] = updatedBot;

			setData(newData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subData]);

	const [getBots] = usePanelBotsLazyQuery();

	useEffect(() => {
		(async () => {
			const { data } = await getBots({
				variables: {
					args: formData,
				},
				fetchPolicy: 'no-cache',
			});
			if (data) {
				setData(data.panelBots.records);
				setTotal(data.panelBots.total);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	return (
		<div className="bots">
			<BotsMainAction setData={setData} />
			<BotsTable data={data} setData={setData} total={total} setFormData={setFormData} />
		</div>
	);
};

export default Bots;
