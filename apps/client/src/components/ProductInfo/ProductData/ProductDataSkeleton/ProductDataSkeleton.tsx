import { Divider } from 'antd';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ProductDataSkeleton = () => {
	return (
		<div className="product-data">
			<div className="product-data__main">
				<p className="product-data__main__time">
					<Skeleton width="159px" height="12px" />
				</p>
				<p className="product-data__main__title">
					<Skeleton />
				</p>
			</div>
			<Divider />
			<div className="product-data__second">
				<div className="product-data__second__code code">
					<div className="code__title">
						<Skeleton />
					</div>
					<div className="code__copycode">
						<Skeleton />
					</div>
				</div>
				<div className="product-data__second__region region">
					<div className="region__title">
						<Skeleton width="90px" height="12px" />
					</div>
					<div className="region__name">
						<Skeleton width="90px" height="20px" />
					</div>
				</div>
				<div className="product-data__second__bot bot">
					<div className="bot__title">
						<Skeleton width="90px" height="12px" />
					</div>
					<div className="bot__info">
						<div className="bot__info-logo">
							<Skeleton circle width={32} height={32} />
						</div>
						<div className="bot__info-name">
							<Skeleton width={60} height={12} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDataSkeleton;
