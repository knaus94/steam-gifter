import { coreConfig } from '@libs/core/common';
import { useTranslation } from 'react-i18next';
import './OurInfo.scss';

const OurInfo = () => {
	return (
		<div className="bottom-wrap">
			<div className="recaptcha">
				This site is protected by reCAPTCHA and the Google
				<a href="https://policies.google.com/privacy" className="recaptcha__link" target="_blank" rel="noreferrer">
					Privacy Policy
				</a>
				and
				<a href="https://policies.google.com/terms" className="recaptcha__link" target="_blank" rel="noreferrer">
					Terms of Service
				</a>
				apply.
			</div>
		</div>
	);
};

export default OurInfo;
