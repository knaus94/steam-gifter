import React from 'react';
import Skeleton from 'react-loading-skeleton';

const StatusSkeleton = () => {
	return (
		<div className="status">
			<p className="status__title">
				<Skeleton height={24} width={450} />
			</p>
			<ul className="status__list list-status">
				<li className={`list-status__item `}>
					<span>
						<Skeleton style={{ marginRight: '32px' }} width={48} height={48} borderRadius={8} />
					</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							<Skeleton width={254} height={24} style={{ marginBottom: '8px' }} />
						</p>
						<p className="list-status__info">
							<Skeleton height={12} width={400} />
						</p>
					</div>
				</li>
				<li className={`list-status__item  `}>
					<span>
						<Skeleton style={{ marginRight: '32px' }} width={48} height={48} borderRadius={8} />
					</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							<Skeleton width={254} height={24} style={{ marginBottom: '8px' }} />
						</p>
						<p className="list-status__info">
							<Skeleton height={12} width={400} />
						</p>
					</div>
				</li>
				<li className={` list-status__item  `}>
					<span>
						<Skeleton style={{ marginRight: '32px' }} width={48} height={48} borderRadius={8} />
					</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							<Skeleton width={254} height={24} style={{ marginBottom: '8px' }} />
						</p>
						<p className="list-status__info">
							<Skeleton height={12} width={400} />
						</p>
					</div>
				</li>
				<li className={` list-status__item  `}>
					<span>
						<Skeleton style={{ marginRight: '32px' }} width={48} height={48} borderRadius={8} />
					</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							<Skeleton width={254} height={24} style={{ marginBottom: '8px' }} />
						</p>
						<p className="list-status__info">
							<Skeleton height={12} width={400} />
						</p>
					</div>
				</li>
				<li className={`  list-status__item  `}>
					<span>
						<Skeleton style={{ marginRight: '32px' }} width={48} height={48} borderRadius={8} />
					</span>
					<div className="list-status__wrap">
						<p className="list-status__createAt">
							<Skeleton width={254} height={24} style={{ marginBottom: '8px' }} />
						</p>
						<p className="list-status__info">
							<Skeleton height={12} width={400} />
						</p>
					</div>
				</li>
			</ul>
		</div>
	);
};

export default StatusSkeleton;
