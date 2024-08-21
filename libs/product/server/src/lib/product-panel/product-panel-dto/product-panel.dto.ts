import { Nullable, SortEnum } from '@libs/core/common';
import {
	BooleanField,
	ClassTransformToPaginationClass,
	DtoType,
	EnumField,
	FloatField,
	IdField,
	NullTransform,
	NumberField,
	PaginationArgs,
	StringField,
	TypedField,
} from '@libs/core/server';
import { Prisma, RegionCodeEnum } from '@prisma/client';
import { ProductPanelType } from '../product-panel-types/product-panel.types';

export enum ProductPanelSortEnum {
	id,
}

@DtoType(ProductPanelSortArgs.name)
export class ProductPanelSortArgs {
	@EnumField(ProductPanelSortEnum, 'ProductPanelSortEnum')
	field: ProductPanelSortEnum;

	@EnumField(SortEnum, 'SortEnum')
	type: SortEnum;
}

@DtoType(ProductPanelArgs.name)
export class ProductPanelArgs extends PaginationArgs {
	@StringField({ nullable: true })
	@NullTransform()
	name?: string;

	@TypedField(() => ProductPanelSortArgs)
	sort: ProductPanelSortArgs;
}

@DtoType(ProductPanelRegionPriceDto.name)
export class ProductPanelRegionPriceDto {
	@EnumField(RegionCodeEnum, 'RegionCodeEnum')
	region: RegionCodeEnum;

	@FloatField()
	price: number;
}

@DtoType(ProductPanelSteamInfoDto.name)
export class ProductPanelSteamInfoDto {
	@StringField({ nullable: true })
	name: Nullable<string>;

	@TypedField(() => ProductPanelRegionPriceDto, { isArray: true })
	prices: ProductPanelRegionPriceDto[];
}

@DtoType(ProductPanelDto.name)
export class ProductPanelDto implements ProductPanelType {
	@IdField()
	id: number;

	@StringField()
	name: string;

	@NumberField()
	identifier: number;

	@BooleanField()
	isBundle: boolean;

	@EnumField(RegionCodeEnum, 'RegionCodeEnum', { isArray: true })
	autoSync: RegionCodeEnum[];

	prices: PrismaJson.RegionPricesType;
}

@DtoType(ProductPanelPaginatedDto.name)
export class ProductPanelPaginatedDto extends ClassTransformToPaginationClass(ProductPanelDto) {}

@DtoType(ProductPanelCreateArgs.name)
export class ProductPanelCreateArgs implements Pick<Prisma.ProductCreateInput, 'identifier' | 'isBundle'> {
	@NumberField()
	identifier: number;

	@BooleanField()
	isBundle: boolean;
}

@DtoType(ProductPanelUpdateArgs.name)
export class ProductPanelUpdateArgs implements Omit<Prisma.ProductUpdateInput, 'prices'> {
	@EnumField(RegionCodeEnum, 'RegionCodeEnum', { isArray: true })
	autoSync: RegionCodeEnum[];

	@NumberField()
	identifier: number;

	@BooleanField()
	isBundle: boolean;

	@StringField()
	name: string;

	@TypedField(() => ProductPanelRegionPriceDto, { isArray: true })
	prices: ProductPanelRegionPriceDto[];
}
