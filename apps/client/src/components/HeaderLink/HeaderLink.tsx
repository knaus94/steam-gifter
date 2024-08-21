import { TransactionStatusEnumType, useUpdateTransactionProfileLinkMutation } from '@generated/client/graphql/types';
import { Nullable, tuple } from '@libs/core/common';
import { Input, InputRef } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../context/ClientContext';
import { ReactComponent as SteamLogo } from '../../images/brand-steam.svg';
import { ReactComponent as Check } from '../../images/check.svg';
import { ReactComponent as Cross } from '../../images/cross.svg';
import { ReactComponent as Loader } from '../../images/loader.svg';
import { ReactComponent as Pencil } from '../../images/pencil.svg';
import Toast from '../Toast/Toast';
import './HeaderLink.scss';
const HeaderLink = () => {
	const { profileLink, logs, uniqCode } = useClientContext();

	const { t } = useTranslation();
	const [isEditMode, setIsEditMode] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [successUpdate, setSuccessUpdate] = useState(false);
	const [newLink, setNewLink] = useState('');
	const [previousValue, setPreviousValue] = useState('');
	const [updateLinkError, setUpdateLinkError] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [updLinkErrorMessage, setUpdLinkErrorMessage] = useState<Nullable<string>>(null);
	const [updLinkErrorText, setUpdLinkErrorText] = useState<Nullable<string>>(null);

	const [updateProfileLink, { loading: updateLoading, error }] = useUpdateTransactionProfileLinkMutation();
	useEffect(() => {
		if (!profileLink) return;
		setNewLink(profileLink);
		setPreviousValue(profileLink);
	}, [profileLink]);

	const { executeRecaptcha } = useGoogleReCaptcha();

	const getToken = useCallback(async () => {
		if (executeRecaptcha) {
			return await executeRecaptcha('UpdateTransactionProfileLink');
		}

		return null;
	}, [executeRecaptcha]);

	const setError = (message: string, text?: string) => {
		if (text) {
			setUpdLinkErrorText(text);
		}

		setUpdLinkErrorMessage(message);
		inputRef.current!.focus({
			cursor: 'all',
		});
		setHasError(true);
		setUpdateLinkError(true);
		return setTimeout(() => {
			setUpdateLinkError(false);
			setUpdLinkErrorMessage(null);
			setUpdLinkErrorText(null);
		}, 2000);
	};

	const updateProfileLinkMethod = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setUpdateLinkError(false);
		const token = await getToken();
		if (!token) {
			return setError(t('recaptcha.code'), t('recaptcha.message'));
		}
		const [result, error] = await tuple(
			updateProfileLink({
				variables: { args: { profileLink: newLink, uniqCode: uniqCode! } },
				context: { headers: { recaptcha: token } },
			}),
		);

		if (error) {
			return setError(
				error.message,
				error?.graphQLErrors?.[0]?.extensions?.validationErrors?.flatMap(({ constraints }) => Object.values(constraints)).join(', '),
			);
		}

		if (result.data) {
			setHasError(false);
			setShowEdit(false);
			setSuccessUpdate(true);
			setIsEditMode(false);
			setTimeout(() => {
				setShowEdit(true);
			}, 1500);
		}
	};

	useEffect(() => {
		if (logs.length > 0 && logs[0].status === TransactionStatusEnumType.Error) {
			setShowEdit(true);
		} else {
			setShowEdit(false);
		}
	}, [logs]);

	const inputRef = useRef<InputRef>(null);
	const handleInputChange = (event) => {
		setNewLink(event.target.value);
	};

	const handleBlur = () => {
		setNewLink(previousValue);
		setIsEditMode(false);
	};

	return (
		<>
			{updateLinkError && <Toast updLinkErrorMessage={updLinkErrorMessage} updLinkErrorText={updLinkErrorText} />}
			<form onSubmit={updateProfileLinkMethod} className={`header__link ${isEditMode ? 'active' : ''} ${hasError ? 'error' : ''}`}>
				<div className="header__link-icon">
					<SteamLogo />
				</div>
				<Input
					type="url"
					required
					defaultValue={profileLink}
					value={newLink}
					onChange={(e) => {
						if (isEditMode) {
							handleInputChange(e);
						}
					}}
					ref={inputRef}
					readOnly={!isEditMode}
				/>
				<div className="link__status">
					{updateLoading ? (
						<button type="button" className="loader">
							<Loader />
						</button>
					) : showEdit ? (
						!isEditMode ? (
							<button
								type="button"
								onClick={() => {
									setIsEditMode(true);
									setNewLink('');
									inputRef.current!.focus({
										cursor: 'all',
									});
								}}
							>
								<Pencil className="pencil-icon" />
							</button>
						) : (
							<>
								<button type="submit">
									<Check className="check-icon" />
								</button>
								<button
									type="button"
									onClick={() => {
										handleBlur();
									}}
								>
									<Cross className="cross-icon" />
								</button>
							</>
						)
					) : successUpdate ? (
						<Check />
					) : null}
				</div>
			</form>
		</>
	);
};

export default HeaderLink;
