import React, { useState, useTransition } from 'react';
import { useClientContext } from '../../context/ClientContext';
import { ReactComponent as Logo } from '../../images/header-logo.svg';
import { ReactComponent as Arrow } from '../../images/arrow-down.svg';
import { useTranslation } from 'react-i18next';
import { LangEnum } from '@libs/core/common';
import HeaderLink from '../HeaderLink/HeaderLink';
import './Header.scss';
import HeaderSkeleton from './HeaderSkeleton';
const Header = () => {
	const [isOpenLanguageSwitcher, setIsOpenLanguageSwitcher] = useState(false);
	const { currentLanguage, setCurrentLanguage, loading, isGlobalError } = useClientContext();
	const { t } = useTranslation();

	const toggleLanguageSwitcher = () => {
		setIsOpenLanguageSwitcher(!isOpenLanguageSwitcher);
	};

	return loading || isGlobalError ? (
		<HeaderSkeleton />
	) : (
		<header className="header">
			<div className="header__title">
				<div className="header__title-icon sk-available">
					<Logo />
				</div>
				<div className="header__title-icon_text">
					<strong className="sk-available">{t('header.your_order')}</strong>
					<span className="sk-available">{t('header.control')}</span>
				</div>
			</div>
			<div className="header__actions">
				<HeaderLink />
				<div className={`sk-available header__actions-language_switcher ${isOpenLanguageSwitcher ? 'active' : ''}`}>
					<div onClick={toggleLanguageSwitcher} className="header__actions-language_switch">
						<span>{currentLanguage.toUpperCase()}</span>
						<Arrow />
					</div>
					{isOpenLanguageSwitcher && (
						<div className="header__actions-language_list">
							{Object.values(LangEnum).map((value, index) => {
								return (
									<li
										key={index}
										onClick={() => {
											setIsOpenLanguageSwitcher(false);
											setCurrentLanguage(value);
										}}
										style={{
											display: currentLanguage !== value ? 'block' : 'none',
										}}
									>
										{value.toUpperCase()}
									</li>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
