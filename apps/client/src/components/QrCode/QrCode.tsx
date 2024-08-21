import React from 'react';
import { useTranslation } from 'react-i18next';
import Telegram from '../../images/telegram.svg';
import { QRCode } from 'antd';

import './QrCode.scss';
import { useClientContext } from '../../context/ClientContext';
import Skeleton from 'react-loading-skeleton';
const QrCode = () => {
	const { t } = useTranslation();
	const { contactsData, loading, isGlobalError } = useClientContext();
	return loading || isGlobalError ? (
		<Skeleton width="393px" height="242px" borderRadius="16px" />
	) : (
		<div className="qrcode">
			<div className="qrcode__info">
				<p className="qrcode__info-title">{t('body.banner2.head')}</p>
				<span className="qrcode__info-text">{t('body.banner2.details')}</span>
			</div>
			<div className="qrcode__qr">
				<a href={`https://t.me/${contactsData?.telegramLogin}`} target="_blank" rel="noreferrer">
					<QRCode
						errorLevel="H"
						value={`https://t.me/${contactsData?.telegramLogin}`}
						type="svg"
						icon={Telegram}
						iconSize={18}
						size={130}
						bordered={false}
					/>
				</a>
				<p className="qrcode__qr-nick">{`@${contactsData?.telegramLogin}`}</p>
			</div>
		</div>
	);
};

export default QrCode;
