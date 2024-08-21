import {
	GetTransactionQuery,
	TransactionStatusEnumType,
	useGetTransactionLazyQuery,
	useTransactionStatusStreamSubscription,
} from '@generated/client/graphql/types';
import { LangEnum } from '@libs/core/common';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import i18n from '../i18n';

type ContactsData = GetTransactionQuery['config'];
type TransactionData = GetTransactionQuery['transaction'];
type Logs = GetTransactionQuery['transaction']['logs'];
type ProfileLink = GetTransactionQuery['transaction']['profileLink'];
interface ClientContextType {
	currentLanguage: LangEnum;
	setCurrentLanguage: React.Dispatch<React.SetStateAction<LangEnum>>;
	loading: boolean;
	data: TransactionData | undefined;
	logs: Logs;
	setLogs: React.Dispatch<React.SetStateAction<Logs>>;
	profileLink: ProfileLink | undefined;
	contactsData: ContactsData | undefined;
	isErrorTransaction: boolean;
	setIsErrorTransaction: React.Dispatch<React.SetStateAction<boolean>>;
	uniqCode: string | null;

	isGlobalError: boolean;
	setIsGlobalError: React.Dispatch<React.SetStateAction<boolean>>;
	globalErrorMessage: string;
}

export const ClientContext = createContext<null | ClientContextType>(null);

export const ClientContextProvider = ({ children }: { children: ReactNode }) => {
	const [currentLanguage, setCurrentLanguage] = useState<LangEnum>(LangEnum.RU);
	const [data, setData] = useState<TransactionData>();
	const [contactsData, setContactsData] = useState<ContactsData>();
	const [logs, setLogs] = useState<Logs>([]);
	const [profileLink, setProfileLink] = useState<ProfileLink>();
	const [isErrorTransaction, setIsErrorTransaction] = useState(false);
	const [isGlobalError, setIsGlobalError] = useState(false);
	const [globalErrorMessage, setGlobalErrorMessage] = useState('');
	const [loading, setLoading] = useState(true);

	const { t } = useTranslation();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const uniqCode = queryParams.get('q');

	const {
		data: subData,
		loading: subLoading,
		error: subError,
	} = useTransactionStatusStreamSubscription({ variables: { args: { uniqCode: uniqCode! } } });

	const [getTransaction] = useGetTransactionLazyQuery({
		variables: { args: { uniqCode: uniqCode! } },
	});

	const [token, setToken] = useState<string>();
	const { executeRecaptcha } = useGoogleReCaptcha();

	const handleReCaptchaVerify = useCallback(async () => {
		if (executeRecaptcha) {
			const token = await executeRecaptcha('Transaction');
			setToken(token);
		}
	}, [executeRecaptcha]);

	useEffect(() => {
		handleReCaptchaVerify();
	}, [handleReCaptchaVerify]);

	useEffect(() => {
		if (subData) {
			setLogs((prev) => {
				const newLogs = prev?.slice();
				newLogs.unshift(subData.TransactionStatusStream);
				return newLogs;
			});
		}
	}, [subData]);

	useEffect(() => {
		if (!token || data) return;
		if (!uniqCode) {
			setIsGlobalError(true);
			return setGlobalErrorMessage(t('error_code'));
		}
		(async () => {
			const { data, error } = await getTransaction({
				context: {
					headers: {
						recaptcha: token,
					},
				},
			});
			if (error) {
				setIsGlobalError(true);
				return setGlobalErrorMessage(error.message);
			}
			setLoading(false);
			if (data) {
				setData(data.transaction);
				setLogs(data.transaction.logs);
				setProfileLink(data.transaction.profileLink);
				setContactsData(data.config);
				if (data.transaction.logs.some((el) => el.status === TransactionStatusEnumType.Error)) {
					setIsErrorTransaction(true);
				}
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	useEffect(() => {
		i18n.changeLanguage(currentLanguage.toLowerCase());
	}, [currentLanguage]);

	const value: ClientContextType = {
		currentLanguage,
		setCurrentLanguage,
		loading,
		data,
		logs,
		setLogs,
		profileLink,
		contactsData,
		isErrorTransaction,
		setIsErrorTransaction,
		uniqCode,
		globalErrorMessage,
		isGlobalError,
		setIsGlobalError,
	};

	return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};

export const useClientContext = () => {
	const clientContext = useContext(ClientContext);

	if (!clientContext) throw new Error('You need to use this context inside provider');

	return clientContext;
};
