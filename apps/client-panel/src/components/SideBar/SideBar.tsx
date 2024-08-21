import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { t } from 'i18next';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ReactComponent as Bot } from '../../images/bot.svg';
import { ReactComponent as Proxy } from '../../images/proxy.svg';
import { ReactComponent as Settings } from '../../images/settings.svg';
import { ReactComponent as Game } from '../../images/game.svg';
import { ReactComponent as Gift } from '../../images/gift.svg';
import { ReactComponent as Coins } from '../../images/transaction.svg';
import './SideBar.scss';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: 'group'): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

const SideBar = () => {
	const location = useLocation();
	const pathSegments = location.pathname.split('/');

	const items: MenuItem[] = [
		getItem(<NavLink to="/transactions">{t('navigation.transactions')}</NavLink>, 'transactions', <Coins className="icon" />),
		getItem(<NavLink to="/proxy">{t('navigation.proxy')}</NavLink>, 'proxy', <Proxy className="icon" />),
		getItem(<NavLink to="/bots">{t('navigation.bots')}</NavLink>, 'bots', <Bot className="icon" />),
		getItem(<NavLink to="/settings">{t('navigation.settings')}</NavLink>, 'settings', <Settings className="icon" />),
		getItem(<NavLink to="/products">{t('navigation.products')}</NavLink>, 'products', <Game className="icon" />),
		getItem(<NavLink to="/gifts">{t('navigation.gifts')}</NavLink>, 'gifts', <Gift className="icon" />),
	];

	return (
		<div className="sidebar">
			<Menu defaultSelectedKeys={[pathSegments[1]]} mode="inline" theme="light" items={items} />
		</div>
	);
};

export default SideBar;
