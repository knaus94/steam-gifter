import React from 'react';
import { useTranslation } from 'react-i18next';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
const NotFound = () => {
	const { t } = useTranslation();
	return (
		<Result
			status="404"
			title="404"
			subTitle={t('not_found')}
			extra={
				<Button type="primary">
					<Link to="/transactions"> {t('back')}</Link>
				</Button>
			}
		/>
	);
};

export default NotFound;
