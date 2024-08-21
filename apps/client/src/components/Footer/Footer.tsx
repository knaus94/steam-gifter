import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Plati } from '../../images/social/plati.svg';
import { ReactComponent as Skype } from '../../images/social/skype.svg';
import { ReactComponent as Telegram } from '../../images/social/tg.svg';
import { ReactComponent as Vk } from '../../images/social/vk.svg';
import { ReactComponent as Discord } from '../../images/social/discord.svg';
import { ReactComponent as Email } from '../../images/social/mail.svg';
import FooterImage from '../../images/hand.png';
import './Footer.scss';
import { useClientContext } from '../../context/ClientContext';
import Skeleton from 'react-loading-skeleton';
const Footer = () => {
	const { t } = useTranslation();
	const { contactsData, loading, isGlobalError } = useClientContext();
	const a = true;
	return loading || isGlobalError ? (
		<Skeleton width="100%" height="160px" borderRadius="16px" className="footer__skeleton" />
	) : (
		<footer className="footer">
			<p className="footer__title">{t('footer.title')}</p>
			<img src={FooterImage} alt="" className="footer__image" />
			<div className="footer__contacts">
				<p className="footer__contacts-title">{t('footer.feedback')}</p>
				<ul className="footer__social">
					{contactsData?.supportLink && (
						<li>
							<a href={contactsData.supportLink} target="_blank" rel="noreferrer">
								<Plati />
							</a>
						</li>
					)}
					{contactsData?.skypeLink && (
						<li>
							<a href={contactsData.skypeLink} target="_blank" rel="noreferrer">
								<Skype />
							</a>
						</li>
					)}
					{contactsData?.telegramLogin && (
						<li>
							<a href={`https://t.me/${contactsData.telegramLogin}`} target="_blank" rel="noreferrer">
								<Telegram />
							</a>
						</li>
					)}
					{contactsData?.vkLink && (
						<li>
							<a href={contactsData.vkLink} target="_blank" rel="noreferrer">
								<Vk />
							</a>
						</li>
					)}
					{contactsData?.discordLink && (
						<li>
							<a href={contactsData.discordLink} target="_blank" rel="noreferrer">
								<Discord />
							</a>
						</li>
					)}
					{contactsData?.email && (
						<li>
							<a href={`mailto:${contactsData.email}`}>
								<Email />
							</a>
						</li>
					)}
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
