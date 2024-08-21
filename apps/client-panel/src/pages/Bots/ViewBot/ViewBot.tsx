import React from 'react';
import { useTranslation } from 'react-i18next';
import './ViewBot.scss';
import { BotStatusEnumType, usePanelBotQuery } from '@generated/client-panel/graphql/types';
import { LoadingOutlined } from '@ant-design/icons';
import { Input, Tag, Tooltip } from 'antd';
import { ReactComponent as TooltipIcon } from '../../../images/tooltip.svg';
import { ReactComponent as DefaultImg } from '../../../images/img.svg';
import { generateProxyName } from 'apps/client-panel/src/utils/generateProxyName';

type Props = {
	id: number | undefined;
};

const ViewBot = ({ id }: Props) => {
	const { t } = useTranslation();
	const { data, loading } = usePanelBotQuery({ variables: { panelBotId: id! }, fetchPolicy: 'no-cache' });

	const colorTag =
		data?.panelBot?.status === BotStatusEnumType.Error || data?.panelBot?.status === BotStatusEnumType.Stopped ? 'red' : 'green';
	return loading ? (
		<LoadingOutlined />
	) : (
		<div className="view-bot">
			<ul className="view-bot__list">
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.status')}:</span>
					<div>
						<Tag color={colorTag} key={data?.panelBot?.status}>
							{t(`bots.status.${data?.panelBot?.status.toLowerCase()}`)}
						</Tag>
						{data?.panelBot?.status === BotStatusEnumType.Error && (
							<Tooltip
								title={() => (
									<div className="bots__tooltip">
										<span className="bots__tooltip-title">{t(`bots.errors.${data.panelBot?.errCode?.toLowerCase()}`)}</span>
										<span className="bots__tooltip-text">{data.panelBot?.errMsg}</span>
									</div>
								)}
							>
								<TooltipIcon />
							</Tooltip>
						)}
					</div>
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.main_balance')}:</span>
					<Input disabled defaultValue={data?.panelBot?.balance} style={{ color: 'black', width: '260px' }} />
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.res_balance')}:</span>

					<Input disabled defaultValue={data?.panelBot?.reservedBalance} style={{ color: 'black', width: '260px' }} />
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.avatar')}:</span>
					{data?.panelBot?.avatarUrl ? (
						<img src={data?.panelBot?.avatarUrl} alt="" className="view-bot__list-item_img" />
					) : (
						<div className="default-img">
							<DefaultImg />
						</div>
					)}
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.username')}:</span>
					<Input disabled defaultValue={data?.panelBot?.accountName} style={{ color: 'black', width: '260px' }} />
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.login')}:</span>
					<Input disabled defaultValue={data?.panelBot?.login} style={{ color: 'black', width: '260px' }} />
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.pass')}:</span>
					<Input.Password disabled defaultValue={data?.panelBot?.password} style={{ color: 'black', width: '260px' }} />
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.steam_id')}:</span>
					<Input disabled defaultValue={data?.panelBot?.steamId64} style={{ color: 'black', width: '260px' }} />
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.key')}:</span>
					<Input.Password disabled defaultValue={data?.panelBot?.sharedSecret} style={{ color: 'black', width: '260px' }} />
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.region')}:</span>
					<Input disabled defaultValue={data?.panelBot?.region} style={{ color: 'black', width: '260px' }} />
				</li>
				<li className="view-bot__list-item">
					<span className="view-bot__list-title">{t('bots.view.proxy')}:</span>
					<Input
						disabled
						defaultValue={data?.panelBot?.proxy ? generateProxyName(data.panelBot?.proxy) : '-'}
						style={{ color: 'black', width: '260px' }}
					/>
				</li>
			</ul>
		</div>
	);
};

export default ViewBot;
