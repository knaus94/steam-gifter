import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ChangePassword.scss';
import { ReactComponent as Sad } from '../../../images/sad.svg';
import { Button, Form, Input, message } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { InputUserPanelUpdatePasswordArgs, usePanelUpdatePasswordMutation } from '@generated/client-panel/graphql/types';
import { ApolloError } from '@apollo/client';

const ChangePassword = () => {
	const [validation, setValidation] = useState({
		length: false,
		bigWord: false,
		smallWord: false,
		number: false,
	});
	const [correctPasword, setCorrectPassword] = useState(false);
	const [pass, setPass] = useState<string>();
	const [correctRepeatPasword, setCorrectRepeatPassword] = useState(false);
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const [change] = usePanelUpdatePasswordMutation();

	const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const upperCaseRegex = /[A-Z]/;
		const lowerCaseRegex = /[a-z]/;
		const numberRegex = /\d/;
		setPass(value);
		const updatedValidation = {
			length: value.length >= 6,
			bigWord: upperCaseRegex.test(value),
			smallWord: lowerCaseRegex.test(value),
			number: numberRegex.test(value),
		};

		const valid = Object.values(updatedValidation).every((value) => value === true);
		if (valid) setCorrectPassword(valid);

		setValidation(updatedValidation);
	};
	const handleValidationRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		value === pass ? setCorrectRepeatPassword(true) : setCorrectRepeatPassword(false);
	};

	const handleSubmit = async (_data: InputUserPanelUpdatePasswordArgs) => {
		if (!correctPasword) {
			return messageApi.open({
				type: 'error',
				content: t('settings.change.pass_validation'),
			});
		}
		if (!correctRepeatPasword) {
			return messageApi.open({
				type: 'error',
				content: t('settings.change.pass_repeat_validation'),
			});
		}

		try {
			await change({ variables: { args: { password: _data.password } } });
			messageApi.open({
				type: 'success',
				content: t('settings.success'),
			});
		} catch (error) {
			if (error instanceof ApolloError) {
				return messageApi.open({
					type: 'error',
					content: error.message,
				});
			}
		}
	};

	return (
		<div>
			{contextHolder}
			<Form
				layout="vertical"
				autoComplete="false"
				className="change-password"
				onFinish={(value: InputUserPanelUpdatePasswordArgs) => handleSubmit(value)}
			>
				<Form.Item label={t('settings.change.pass')} name="password">
					<Input.Password
						autoComplete="false"
						className="login_form__input"
						placeholder={t('settings.change.pass_placeholder')}
						onChange={handleValidation}
					/>
				</Form.Item>
				<div className="change-password__list">
					<p className={`change-password__validation ${validation.length ? 'success' : ''}`}>
						<span>
							{validation.length ? (
								<SmileOutlined className="change-password__icon-success" />
							) : (
								<Sad className="change-password__icon" />
							)}
						</span>
						{t('settings.change.count')}
					</p>
					<p className={`change-password__validation ${validation.bigWord ? 'success' : ''}`}>
						<span>
							{validation.bigWord ? (
								<SmileOutlined className="change-password__icon-success" />
							) : (
								<Sad className="change-password__icon" />
							)}
						</span>
						{t('settings.change.big')}
					</p>
					<p className={`change-password__validation ${validation.smallWord ? 'success' : ''}`}>
						<span>
							{validation.smallWord ? (
								<SmileOutlined className="change-password__icon-success" />
							) : (
								<Sad className="change-password__icon" />
							)}
						</span>
						{t('settings.change.little')}
					</p>
					<p className={`change-password__validation ${validation.number ? 'success' : ''}`}>
						<span>
							{validation.number ? (
								<SmileOutlined className="change-password__icon-success" />
							) : (
								<Sad className="change-password__icon" />
							)}
						</span>
						{t('settings.change.int')}
					</p>
				</div>
				<Form.Item
					label={t('settings.change.pass_repeat')}
					name="password_repeat"
					className={correctRepeatPasword ? 'corrent' : 'incorrect'}
				>
					<Input.Password
						autoComplete="false"
						className="login_form__input"
						placeholder={t('settings.change.pass_repeat_placeholder')}
						onChange={handleValidationRepeat}
					/>
				</Form.Item>
				<Button type="primary" htmlType="submit">
					{t('save')}
				</Button>
			</Form>
		</div>
	);
};

export default ChangePassword;
