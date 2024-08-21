import { ApolloProvider } from '@apollo/client';
import * as ReactDOM from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { BrowserRouter } from 'react-router-dom';
import client from './apolloClient';
import App from './app/app';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<ApolloProvider client={client}>
		<BrowserRouter>
			<GoogleReCaptchaProvider
				reCaptchaKey={process.env.NX_GOOGLE_RECAPTCHA_PUBLIC_KEY!}
				language={window.navigator.language}
				scriptProps={{
					async: false,
					defer: false,
					appendTo: 'head',
					nonce: undefined,
				}}
			>
				<App />
			</GoogleReCaptchaProvider>
		</BrowserRouter>
	</ApolloProvider>,
);
