import { usePanelLogInMutation } from '@generated/client-panel/graphql/types';
import { coreConfig } from '@libs/core/common';
import { Button, Form, Input, message } from 'antd';
import Cookies from 'js-cookie';
import { useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import './Login.scss';

type FieldType = {
	email?: string;
	password?: string;
	remember?: string;
};

const Login = () => {
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();
	const { executeRecaptcha } = useGoogleReCaptcha();

	const navigate = useNavigate();
	const [login, { loading, error, client }] = usePanelLogInMutation();

	const getToken = useCallback(async () => {
		if (executeRecaptcha) {
			return await executeRecaptcha('PanelLogIn');
		}

		return null;
	}, [executeRecaptcha]);

	const onFinish = async (values: { email: string; password: string }) => {
		const token = await getToken();
		if (!token) {
			return messageApi.open({
				type: 'error',
				content: t('recaptcha.message'),
			});
		}
		try {
			const { data } = await login({
				variables: {
					args: {
						...values,
					},
				},
				context: {
					headers: {
						recaptcha: token,
					},
				},
			});
			if (data) {
				const date = new Date(data.panelLogIn.expiresAt);

				Cookies.set('token', data.panelLogIn.token, { expires: date });
				navigate('/transactions');
			}

			client.resetStore();
		} catch (error: any) {
			return messageApi.open({
				type: 'error',
				content: error?.message,
			});
		}
	};

	return (
		<div className="login">
			{contextHolder}
			<div className="box">
				<Form
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					style={{ maxWidth: 600 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="off"
					className="login__form"
				>
					<Form.Item<FieldType>
						label={t('login.username')}
						name="email"
						rules={[{ required: true, message: t('login.validation_email') }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label={t('login.password')}
						name="password"
						rules={[{ required: true, message: t('login.validation_password') }]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit" style={{ marginRight: `10px` }}>
							{t('login.enter')}
						</Button>
					</Form.Item>
				</Form>
				<div className="recaptcha">
					This site is protected by reCAPTCHA and the Google
					<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="recaptcha__link">
						Privacy Policy
					</a>
					and
					<a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="recaptcha__link">
						Terms of Service
					</a>
					apply.
				</div>
			</div>
		</div>
	);
};

export default Login;
