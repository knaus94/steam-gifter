import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ToastIcon } from '../../images/toast.svg';
import './Toast.scss';
import { Nullable } from '@libs/core/common';
type Props = {
	updLinkErrorMessage: Nullable<string>;
	updLinkErrorText: Nullable<string>;
};
const Toast = ({ updLinkErrorMessage, updLinkErrorText }: Props) => {
	const { t } = useTranslation();
	return (
		<div className="toast">
			<ToastIcon />
			<div className="toast__info">
				<span className="toast__title">{updLinkErrorMessage ? updLinkErrorMessage : t('toast.title')}</span>
				<span className="toast__text">{updLinkErrorText ? updLinkErrorText : t('toast.text')}</span>
			</div>
		</div>
	);
};

export default Toast;
