import { GetTransactionQuery, useResendTransactionMutation } from '@generated/client/graphql/types';
import { Nullable } from '@libs/core/common';
import { useCallback, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../context/ClientContext';
import { ReactComponent as Request } from '../../images/request.svg';
import { ReactComponent as Error } from '../../images/transaction-error.svg';
import Toast from '../Toast/Toast';
import './TransactionError.scss';
type Event = GetTransactionQuery['transaction']['logs'][0]['event'];
type Props = {
	event: Event;
};
const TransactionError = ({ event }: Props) => {
	const { t } = useTranslation();
	const { setLogs, uniqCode } = useClientContext();
	const [resentTransaction] = useResendTransactionMutation({ errorPolicy: 'none' });
	const [resendError, setResendError] = useState(false);
	const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null);
	const [errorText, setErrorText] = useState<Nullable<string>>(null);
	const { executeRecaptcha } = useGoogleReCaptcha();

	const getToken = useCallback(async () => {
		if (executeRecaptcha) {
			return await executeRecaptcha('ResendTransaction');
		}

		return null;
	}, [executeRecaptcha]);

	const setError = (message: string, text?: string) => {
		if (text) {
			setErrorText(text);
		}

		setErrorMessage(message);
		setResendError(true);
		setTimeout(() => {
			setResendError(false);
			setErrorText(null);
			setErrorMessage(null);
		}, 2000);
	};

	const resentTransactionMethod = async () => {
		const token = await getToken();
		if (!token) {
			return setError(t('recaptcha.code'), t('recaptcha.message'));
		}

		await resentTransaction({
			variables: { args: { uniqCode: uniqCode! } },
			errorPolicy: 'none',
			context: { headers: { recaptcha: token } },
		})
			.then(() => {
				setLogs([]);
			})
			.catch((error) => {
				if (error) {
					return setError(
						error.message,
						error?.graphQLErrors?.[0]?.extensions?.validationErrors
							?.flatMap(({ constraints }) => Object.values(constraints))
							.join(', '),
					);
				}
			});
	};

	return (
		<>
			{resendError && <Toast updLinkErrorMessage={errorMessage} updLinkErrorText={errorText} />}
			<div className="transaction-error">
				<Error className="transaction-error__icon-error" />
				<span className="transaction-error__title">{t('error')}</span>
				<p className="transaction-error__text">{event ? t(`errors.${event}`) : t('error')}</p>
				<button className="transaction-error__btn" onClick={() => resentTransactionMethod()}>
					<Request />
					{t('history.request_again')}
				</button>
			</div>
		</>
	);
};

export default TransactionError;
