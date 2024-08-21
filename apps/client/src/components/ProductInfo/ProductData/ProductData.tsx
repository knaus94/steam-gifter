import { Divider, Popover } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useClientContext } from 'apps/client/src/context/ClientContext';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Copy } from '../../../images/copy.svg';
import './ProductData.scss';
import ProductDataSkeleton from './ProductDataSkeleton/ProductDataSkeleton';

const ProductData: React.FC = () => {
	const { t } = useTranslation();
	const { data, currentLanguage, loading, uniqCode, isGlobalError } = useClientContext();
	let formattedTime = '';
	let formattedDate = '';

	if (data?.logs) {
		formattedTime = moment(data.createdAt).locale(currentLanguage).format('HH:mm:ss');
		formattedDate = moment(data.createdAt).locale(currentLanguage).format('ll');
	}

	return loading || isGlobalError ? (
		<ProductDataSkeleton />
	) : (
		<div className="product-data">
			<div className="product-data__main">
				<p className="product-data__main__time">
					<span>{t('body.time_buy')}</span>
					<span className="formatted">{formattedTime}</span>
					<span>/</span>
					<span className="formatted">{formattedDate}</span>
				</p>
				<p className="product-data__main__title">{data?.edition.digisellerProduct.name?.[currentLanguage] ?? 'null'}</p>
			</div>
			<Divider />
			<div className="product-data__second">
				<div className="product-data__second__code code">
					<div className="code__title">{t('body.code')}</div>
					<div className="code__copycode">
						<Paragraph
							copyable={{ icon: [<Copy />], tooltips: [t('body.copy'), t('body.copied')] }}
							className="code__copycode-paragraph"
						>
							{uniqCode}
						</Paragraph>
					</div>
				</div>
				<div className="product-data__second__region region">
					<div className="region__title">{t('body.region')}</div>
					<div className="region__name">
						<Popover placement="topLeft" content={<p>{data?.region}</p>}>
							{data?.region}
						</Popover>
					</div>
				</div>
				<div className="product-data__second__bot bot">
					<div className="bot__title">{t('body.bot')}</div>
					<div className="bot__info">
						<div className="bot__info-logo">
							<img src={data?.bot?.avatarUrl ?? ''} alt="" />
						</div>
						<div className="bot__info-name">{data?.bot?.accountName}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductData;
