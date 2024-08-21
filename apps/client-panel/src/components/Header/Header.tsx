import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Key } from '../../images/key.svg';
import { ReactComponent as Exit } from '../../images/exit.svg';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import './Header.scss';

const Header = () => {
	const { t } = useTranslation();
	const handleExit = () => {
		Cookies.remove('token');
	};

	return (
		<header className="header">
			<Link to={'/'} className="header__icon">
				<Key />
			</Link>
			<h1 className="header__title">{t('header.title')}</h1>

			<Link to="/login" className="header__exit" onClick={() => handleExit()}>
				{t('header.exit')}
				<Exit />
			</Link>
		</header>
	);
};

export default Header;
