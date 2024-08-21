import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Success } from '../../images/success.svg';

import './TransactionSuccess.scss';
import { useClientContext } from '../../context/ClientContext';
const TransactionSuccess: React.FC = () => {
	const { t } = useTranslation();
	const { data } = useClientContext();
	return (
		<div className="transaction-success">
			<Success />
			<span style={{ whiteSpace: 'pre-line' }} className="transaction-success__text">
				{t('success_order')}
			</span>
			<a
				href={`https://digiseller.market/info/buy.asp?id_i=${data?.paymentDetails.invoice}`}
				className="transaction-success__btn"
				target="_blank"
				rel="noreferrer"
			>
				{t('order_back')}
			</a>
		</div>
	);
};

export default TransactionSuccess;
