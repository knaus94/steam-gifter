import { Nullable, SortEnum } from '@libs/core/common';
import {
	BooleanField,
	ClassTransformToPaginationClass,
	DateField,
	DtoType,
	EnumField,
	IdField,
	NullTransform,
	NumberField,
	PaginationArgs,
	StringField,
	TranslateField,
	TranslationDto,
	TypedField,
} from '@libs/core/server';
import { ProductPanelDto } from '@libs/product/server/lib/product-panel/product-panel-dto/product-panel.dto';
import { DigisellerProduct, Prisma, RegionCodeEnum } from '@prisma/client';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, ValidateIf } from 'class-validator';
import {
	DigisellerProductEditionBotPanelType,
	DigisellerProductEditionPanelType,
	DigisellerProductPanelType,
} from '../digiseller-panel-types/digiseller-panel.types';
import { DigisellerRegionPanelDto } from './digiseller-config-panel.dto';

@DtoType(DigisellerProductInfoRegionDto.name)
export class DigisellerProductInfoRegionDto implements PrismaJson.DigisellerProductRegion {
	@IdField()
	id: number;

	@StringField()
	name: string;
}
@DtoType(DigisellerProductInfoDto.name)
export class DigisellerProductInfoDto {
	@StringField()
	name: string;

	@StringField({ nullable: true })
	preview: Nullable<string>;

	@BooleanField()
	editionEnabled: boolean;

	@StringField({ isArray: true })
	editions: string[];
}

export enum DigisellerProductPanelSortEnum {
	id = 'id',
	createdAt = 'createdAt',
	updatedAt = 'updatedAt',
}

@DtoType(DigisellerProductPanelSortArgs.name)
export class DigisellerProductPanelSortArgs {
	@EnumField(DigisellerProductPanelSortEnum, 'DigisellerProductPanelSortEnum')
	field: DigisellerProductPanelSortEnum;

	@EnumField(SortEnum, 'SortEnum')
	type: SortEnum;
}

@DtoType(DigisellerProductPanelArgs.name)
export class DigisellerProductPanelArgs
	extends PaginationArgs
	implements Partial<Pick<DigisellerProduct, 'isDisabled' | 'digisellerId' | 'id'>>
{
	@NumberField({ nullable: true })
	@NullTransform()
	id?: number;

	@NumberField({ nullable: true })
	@NullTransform()
	digisellerId?: number;

	@StringField({ nullable: true })
	@NullTransform()
	name?: string;

	@TypedField(() => DigisellerProductPanelSortArgs)
	sort: DigisellerProductPanelSortArgs;

	@BooleanField({ nullable: true })
	@NullTransform()
	isDisabled?: boolean;
}

@DtoType(DigisellerProductPanelCreateArgs.name)
export class DigisellerProductPanelCreateArgs implements Omit<Prisma.DigisellerProductUncheckedCreateInput, 'preview' | 'editions' | 'userId'> {
	@IdField()
	digisellerId: number;

	@BooleanField()
	editionSelection: boolean;

	@BooleanField()
	isDisabled: boolean;

	@TypedField(() => TranslationDto)
	name: PrismaJson.TranslationType;

	@BooleanField({ nullable: true })
	@NullTransform()
	syncPrice?: boolean;

	@NumberField()
	syncPricePercent: number;

	@EnumField(RegionCodeEnum, 'RegionCodeEnum')
	syncPriceRegion: RegionCodeEnum;

	@StringField({ nullable: true })
	previewUrl: Nullable<string>;

	@TypedField(() => DigisellerProductEditionPanelArgs, { isArray: true })
	@ArrayUnique((o) => o?.name)
	@ArrayMinSize(1)
	@ValidateIf((o) => o?.editionSelection === false)
	@ArrayMaxSize(1)
	editions: DigisellerProductEditionPanelArgs[];
}

@DtoType(DigisellerProductPanelUpdateArgs.name)
export class DigisellerProductPanelUpdateArgs implements Omit<Prisma.DigisellerProductUncheckedUpdateInput, 'previewUrl' | 'editions'> {
	@IdField()
	digisellerId: number;

	@BooleanField()
	editionSelection: boolean;

	@BooleanField()
	isDisabled: boolean;

	@TypedField(() => TranslationDto)
	name: PrismaJson.TranslationType;

	@BooleanField()
	syncPrice: boolean;

	@NumberField()
	syncPricePercent: number;

	@EnumField(RegionCodeEnum, 'RegionCodeEnum')
	syncPriceRegion: RegionCodeEnum;

	@TypedField(() => DigisellerProductEditionPanelArgs, { isArray: true })
	@ArrayUnique((o: DigisellerProductEditionPanelArgs) => o?.name)
	@ArrayMinSize(1)
	@ValidateIf((o) => o?.editionSelection === false)
	@ArrayMaxSize(1)
	editions: DigisellerProductEditionPanelArgs[];

	@StringField({ nullable: true })
	previewUrl: null;
}

@DtoType(DigisellerProductEditionPanelArgs.name)
export class DigisellerProductEditionPanelArgs
	implements Omit<Prisma.DigisellerProductEditionUncheckedCreateInput, 'digisellerProductId' | 'bots'>
{
	@IdField()
	productId: number;

	@StringField({ nullable: true })
	name: Nullable<string>;

	@BooleanField({ nullable: true })
	@NullTransform()
	isDefault?: boolean;

	@TypedField(() => DigisellerProductEditionBotPanelArgs, { isArray: true })
	bots: DigisellerProductEditionBotPanelArgs[];
}
@DtoType(DigisellerProductEditionBotPanelDto.name)
export class DigisellerProductEditionBotPanelDto implements DigisellerProductEditionBotPanelType {
	@TypedField(() => DigisellerRegionPanelDto)
	region: DigisellerRegionPanelDto;

	@EnumField(RegionCodeEnum, 'RegionCodeEnum', { isArray: true })
	botRegions: RegionCodeEnum[];
}

@DtoType(DigisellerProductEditionBotPanelArgs.name)
export class DigisellerProductEditionBotPanelArgs implements Omit<Prisma.DigisellerProductEditionBotsUncheckedCreateInput, 'editionId'> {
	@IdField()
	regionId: number;

	@EnumField(RegionCodeEnum, 'RegionCodeEnum', { isArray: true })
	botRegions: RegionCodeEnum[];
}

@DtoType(DigisellerProductPanelDto.name)
export class DigisellerProductPanelDto implements DigisellerProductPanelType {
	@IdField()
	id: number;

	@IdField()
	digisellerId: number;

	@BooleanField()
	editionSelection: boolean;

	@BooleanField()
	isDisabled: boolean;

	@TranslateField()
	name: PrismaJson.TranslationType;

	@StringField({ nullable: true })
	previewUrl: Nullable<string>;

	@TypedField(() => DigisellerProductEditionPanelDto, { isArray: true })
	editions: DigisellerProductEditionPanelDto[];

	@BooleanField()
	syncPrice: boolean;

	@NumberField()
	syncPricePercent: number;

	@EnumField(RegionCodeEnum, 'RegionCodeEnum')
	syncPriceRegion: RegionCodeEnum;

	@DateField()
	createdAt: Date;

	@DateField()
	updatedAt: Date;
}

@DtoType(DigisellerProductPanelPaginatedDto.name)
export class DigisellerProductPanelPaginatedDto extends ClassTransformToPaginationClass(DigisellerProductPanelDto) {}

@DtoType(DigisellerProductEditionPanelDto.name)
export class DigisellerProductEditionPanelDto implements DigisellerProductEditionPanelType {
	@IdField()
	id: number;

	@StringField({ nullable: true })
	name: Nullable<string>;

	@TypedField(() => ProductPanelDto)
	product: ProductPanelDto;

	@TypedField(() => DigisellerProductEditionBotPanelDto, { isArray: true })
	bots: DigisellerProductEditionBotPanelDto[];

	@BooleanField()
	isDefault: boolean;
}
