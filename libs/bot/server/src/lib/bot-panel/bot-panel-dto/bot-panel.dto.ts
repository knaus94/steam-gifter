import { Nullable, SortEnum } from '@libs/core/common';
import {
	ClassTransformToPaginationClass,
	DtoType,
	EnumField,
	FloatField,
	IdField,
	NullTransform,
	PaginationArgs,
	StringField,
	TypedField,
} from '@libs/core/server';
import { Bot, BotErrCodeEnum, BotStatusEnum, Prisma, RegionCodeEnum } from '@prisma/client';
import { BotPanelType } from '../bot-panel-types/bot-panel.types';
import { ProxyPanelDto } from '@libs/proxy/server/lib/proxy-panel/proxy-panel-dto/proxy-panel.dto';

@DtoType(BotPanelParseInfoDto.name)
export class BotPanelParseInfoDto {
	@StringField({ nullable: true })
	avatarUrl: Nullable<string>;

	@StringField({ nullable: true })
	accountName: Nullable<string>;
}

export enum BotPanelSortEnum {
	id,
}

@DtoType(BotPanelSortArgs.name)
export class BotPanelSortArgs {
	@EnumField(BotPanelSortEnum, 'BotPanelSortEnum')
	field: BotPanelSortEnum;

	@EnumField(SortEnum, 'SortEnum')
	type: SortEnum;
}

@DtoType(BotPanelArgs.name)
export class BotPanelArgs extends PaginationArgs implements Partial<Pick<Bot, 'accountName' | 'steamId64' | 'login' | 'status'>> {
	@StringField({ nullable: true })
	@NullTransform()
	steamId64?: string;

	@StringField({ nullable: true })
	@NullTransform()
	login?: string;

	@TypedField(() => BotPanelSortArgs)
	sort: BotPanelSortArgs;

	@EnumField(BotStatusEnum, 'BotStatusEnum', { nullable: true })
	@NullTransform()
	status?: BotStatusEnum;
}

@DtoType(BotPanelCreateArgs.name)
export class BotPanelCreateArgs implements Omit<Prisma.BotUncheckedCreateInput, 'userId'> {
	@StringField()
	accountName: string;

	@StringField()
	login: string;

	@StringField()
	password: string;

	@EnumField(RegionCodeEnum, 'RegionCodeEnum')
	region: RegionCodeEnum;

	@StringField()
	sharedSecret: string;

	@StringField()
	steamId64: string;

	@IdField({ nullable: true })
	proxyId: Nullable<number>;

	@StringField({ nullable: true })
	@NullTransform()
	avatarUrl?: string;
}

@DtoType(BotPanelUpdateArgs.name)
export class BotPanelUpdateArgs extends BotPanelCreateArgs implements Prisma.BotUncheckedUpdateInput {}

@DtoType(BotPanelDto.name)
export class BotPanelDto implements BotPanelType {
	@IdField()
	id: number;

	@StringField()
	steamId64: string;

	@EnumField(RegionCodeEnum, 'RegionCodeEnum')
	region: RegionCodeEnum;

	@StringField()
	accountName: string;

	@StringField()
	login: string;

	@StringField({ nullable: true })
	avatarUrl: Nullable<string>;

	@StringField()
	sharedSecret: string;

	@FloatField()
	balance: number;

	@FloatField()
	reservedBalance: number;

	@EnumField(BotStatusEnum, 'BotStatusEnum')
	status: BotStatusEnum;

	@EnumField(BotErrCodeEnum, 'BotErrCodeEnum', { nullable: true })
	errCode: Nullable<BotErrCodeEnum>;

	@StringField({ nullable: true })
	errMsg: Nullable<string>;

	@StringField()
	password: string;

	@TypedField(() => ProxyPanelDto, { nullable: true })
	proxy: Nullable<ProxyPanelDto>;
}

@DtoType(BotPanelPaginatedDto.name)
export class BotPanelPaginatedDto extends ClassTransformToPaginationClass(BotPanelDto) {}
