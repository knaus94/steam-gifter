import React from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useClientContext } from '../../context/ClientContext';
import ImgBanner from '../../images/banner.jpg';
import { coreConfig } from '@libs/core/common';
import './Banner.scss';

const Banner: React.FC = () => {
	const { t } = useTranslation();
	const { loading, isGlobalError, data } = useClientContext();

	return loading || isGlobalError ? <Skeleton width="393px" height="250px" borderRadius="16px" /> : <div className="banner"></div>;
};

export default Banner;
