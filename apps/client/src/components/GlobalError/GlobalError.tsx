import React from 'react';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../context/ClientContext';
import { ReactComponent as Reload } from '../../images/reload.svg';
import { ReactComponent as Error } from '../../images/transaction-error.svg';
import './GlobalError.scss';

const GlobalError: React.FC = () => {
	const { t } = useTranslation();
	const { globalErrorMessage } = useClientContext();
	const handleReload = () => {
		window.location.reload();
	};

	return (
		<div className="global-error">
			<Error className="global-error__icon" />
			<span className="global-error__title">{t('error')}</span>
			<p className="global-error__text">{globalErrorMessage}</p>
			<button type="button" className="global-error__btn" onClick={() => handleReload()}>
				<Reload />
				{t('reload')}
			</button>
		</div>
	);
};

export default GlobalError;
