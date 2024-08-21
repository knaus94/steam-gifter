import { Nullable, SortEnum } from '@libs/core/common';
import {
	BooleanField,
	ClassTransformToPaginationClass,
	DtoType,
	EnumField,
	IdField,
	NullTransform,
	NumberField,
	PaginationArgs,
	StringField,
	TypedField,
} from '@libs/core/server';
import { Prisma, Proxy } from '@prisma/client';
import { IsIP } from 'class-validator';
import { ProxyPanelType } from '../proxy-panel-types/proxy-panel.types';

export enum ProxyPanelSortEnum {
	id,
	bots,
}

@DtoType(ProxyPanelSortArgs.name)
export class ProxyPanelSortArgs {
	@EnumField(ProxyPanelSortEnum, 'ProxyPanelSortByEnum')
	field: ProxyPanelSortEnum;

	@EnumField(SortEnum, 'SortEnum')
	type: SortEnum;
}

@DtoType(ProxyPanelArgs.name)
export class ProxyPanelArgs extends PaginationArgs implements Partial<Pick<Proxy, 'address'>> {
	@StringField({ nullable: true })
	@NullTransform()
	address?: string;

	@BooleanField({ nullable: true })
	@NullTransform()
	isValid?: boolean;

	@TypedField(() => ProxyPanelSortArgs)
	sort: ProxyPanelSortArgs;
}

@DtoType(ProxyPanelDto.name)
export class ProxyPanelDto implements ProxyPanelType {
	@IdField()
	id: number;

	@StringField()
	address: string;

	@NumberField()
	port: number;

	@StringField({ nullable: true })
	username: Nullable<string>;

	@StringField({ nullable: true })
	password: Nullable<string>;

	@BooleanField()
	isValid: boolean;
}

@DtoType(ProxyPanelPaginatedDto.name)
export class ProxyPanelPaginatedDto extends ClassTransformToPaginationClass(ProxyPanelDto) {}

@DtoType(ProxyPanelCreateArgs.name)
export class ProxyPanelCreateArgs implements Prisma.ProxyCreateInput {
	@StringField()
	@IsIP(4)
	address: string;

	@NumberField()
	// @IsPort()
	port: number;

	@StringField({ nullable: true })
	username: Nullable<string>;

	@StringField({ nullable: true })
	password: Nullable<string>;
}
