import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsProps } from 'antd';
import PanelConfig from './PanelConfig/PanelConfig';
import './Settings.scss';
import Digiseller from './Digiseller/Digiseller';
import Telegram from './Telegram/Telegram';
import ChangePassword from './ChangePassword/ChangePassword';

const Settings = () => {
	const { t } = useTranslation();
	const items: TabsProps['items'] = [
		{
			key: '1',
			label: t('settings.config'),
			children: <PanelConfig />,
		},
		{
			key: '2',
			label: t('settings.digiseller'),
			children: <Digiseller />,
		},
		{
			key: '3',
			label: t('settings.telegram'),
			children: <Telegram />,
		},
		{
			key: '4',
			label: t('settings.pass'),
			children: <ChangePassword />,
		},
	];
	return <Tabs defaultActiveKey="1" items={items} />;
};

export default Settings;
