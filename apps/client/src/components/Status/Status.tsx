import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Status.scss';

import { TransactionStatusEnumType } from '@generated/client/graphql/types';
import { useClientContext } from '../../context/ClientContext';
import TransactionError from '../TransactionError/TransactionError';
import moment from 'moment';
import TransactionSuccess from '../TransactionSuccess/TransactionSuccess';
import StatusSkeleton from './StatusSkeleton';
const Status = () => {
	const { t } = useTranslation();

	const { logs, currentLanguage, loading, isGlobalError } = useClientContext();

	const [statuses] = useState(['CREATED', 'FRIEND_REQUEST_SENT', 'PROCESS', 'SENT_GIFT', 'SUCCESS']);

	const checkActiveStatus = (position: number) => {
		if (logs.length > 0) {
			return statuses.indexOf(logs[0].status) > position;
		}
	};

	return loading || isGlobalError ? (
		<StatusSkeleton />
	) : (
		<div className="status">
			<p className="status__title">{t('history.title')}:</p>
			<ul className="status__list list-status">
				<li
					className={`list-status__item ${logs.length > 0 && logs[0].status === TransactionStatusEnumType.Created ? 'current' : ''} ${
						logs.length > 0 && checkActiveStatus(-1) ? 'active' : ''
					}`}
				>
					<span className="list-status__number">1</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							{logs.length > 0 && checkActiveStatus(-1)
								? moment(logs[logs.length - 1].createdAt)
										.locale(currentLanguage)
										.format('HH:mm:ss')
								: ''}
						</p>
						<p className="list-status__info">{t('history.step1')}</p>
					</div>
				</li>
				<li
					className={`list-status__item ${
						logs.length > 0 && logs[0].status === TransactionStatusEnumType.FriendRequestSent ? 'current' : ''
					} ${logs.length > 0 && checkActiveStatus(0) ? 'active' : ''}`}
				>
					<span className="list-status__number">2</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							{logs.length > 1
								? moment(logs[logs.length - 2].createdAt)
										.locale(currentLanguage)
										.format('HH:mm:ss')
								: ''}
						</p>
						<p className="list-status__info">{t('history.step2')}</p>
					</div>
				</li>
				<li
					className={` list-status__item ${logs.length > 0 && logs[0].status === TransactionStatusEnumType.Process ? 'current' : ''} ${
						logs.length > 0 && checkActiveStatus(1) ? 'active' : ''
					}`}
				>
					<span className="list-status__number">3</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							{logs.length > 2
								? moment(logs[logs.length - 3].createdAt)
										.locale(currentLanguage)
										.format('HH:mm:ss')
								: ''}
						</p>
						<p className="list-status__info">{t('history.step3')}</p>
					</div>
				</li>
				<li
					className={` list-status__item  ${
						logs.length > 0 && logs[0].status === TransactionStatusEnumType.SentGift ? 'current' : ''
					} ${logs.length > 0 && checkActiveStatus(2) ? 'active' : ''}`}
				>
					<span className="list-status__number">4</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							{logs.length > 3 ? moment(logs[0].createdAt).locale(currentLanguage).format('HH:mm:ss') : ''}
						</p>
						<p className="list-status__info">{t('history.step4')}</p>
					</div>
				</li>
				<li
					className={`  list-status__item ${
						logs.length > 0 && logs[0].status === TransactionStatusEnumType.Success ? 'current' : ''
					} ${logs.length > 0 && checkActiveStatus(3) ? 'active' : ''}`}
				>
					<span className="list-status__number">5</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							{logs.length > 4
								? moment(logs[logs.length - 5].createdAt)
										.locale(currentLanguage)
										.format('HH:mm:ss')
								: ''}
						</p>
						<p className="list-status__info">{t('history.step5')}</p>
					</div>
				</li>
			</ul>
			{logs.length > 0 && logs[0].status === TransactionStatusEnumType.Error && <TransactionError event={logs[0].event} />}
			{logs.length > 0 && logs[0].status === TransactionStatusEnumType.Success && <TransactionSuccess />}
		</div>
	);
};

export default Status;
