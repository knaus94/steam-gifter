import React from 'react';
import Skeleton from 'react-loading-skeleton';

const HeaderSkeleton = () => {
	return (
		<header className="header">
			<div className="header__title">
				<div className="header__title-icon sk-available">
					<Skeleton width={40} height={40} borderRadius={8} />
				</div>
				<div className="header__title-icon_text">
					<strong className="sk-available">
						<Skeleton width={121} height={24} />
					</strong>
					<span className="sk-available">
						<Skeleton width={210} height={12} />
					</span>
				</div>
			</div>
			<div className="header__actions">
				<Skeleton width={470} height={48} style={{ marginLeft: '65px' }} />
				<div className={`sk-available header__actions-language_switcher`}>
					<Skeleton width={72} height={48} style={{ marginLeft: '20px' }} />
				</div>
			</div>
		</header>
	);
};

export default HeaderSkeleton;
