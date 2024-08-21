import React from 'react';
import ProductData from './ProductData/ProductData';
import './ProductInfo.scss';
import { useClientContext } from '../../context/ClientContext';
import Skeleton from 'react-loading-skeleton';
const ProductInfo = () => {
	const { data } = useClientContext();

	return (
		<div className="product-info">
			<div className="product-info__image">
				{!data ? (
					<Skeleton width="308px" height="225px" borderRadius="16px" />
				) : data?.edition?.digisellerProduct.previewUrl ? (
					<img src={`${data?.edition.digisellerProduct.previewUrl}`} alt="" />
				) : (
					<div className="default-img"></div>
				)}
			</div>
			<ProductData />
		</div>
	);
};

export default ProductInfo;
