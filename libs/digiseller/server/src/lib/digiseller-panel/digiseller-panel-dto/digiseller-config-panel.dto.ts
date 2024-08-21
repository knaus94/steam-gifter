import { Nullable } from '@libs/core/common';
import { DateField, DtoType, IdField, StringField, TranslateField, TranslationDto, TypedField } from '@libs/core/server';
import { DigisellerConfigType, DigisellerRegionType } from '@libs/digiseller/server';
import { Prisma } from '@prisma/client';
import { ArrayMaxSize, ArrayUnique } from 'class-validator';

@DtoType(DigisellerConfigPanelDto.name)
export class DigisellerConfigPanelDto implements DigisellerConfigType {
	@StringField({ nullable: true })
	apiKey: Nullable<string>;

	@TranslateField()
	editionSelectionFieldName: PrismaJson.TranslationType;

	@IdField()
	id: number;

	@TranslateField()
	profileLinkFieldName: PrismaJson.TranslationType;

	@TranslateField()
	regionFieldName: PrismaJson.TranslationType;

	@IdField({ nullable: true })
	sellerId: Nullable<number>;

	@StringField({ nullable: true, isHidden: true })
	token: Nullable<string>;

	@DateField({ nullable: true, isHidden: true })
	tokenUpdatedAt: Nullable<Date>;

	@TypedField(() => DigisellerRegionPanelDto, { isArray: true })
	regions: DigisellerRegionPanelDto[];
}

@DtoType(DigisellerRegionPanelDto.name)
export class DigisellerRegionPanelDto implements DigisellerRegionType {
	@IdField()
	id: number;

	@StringField()
	name: string;
}

@DtoType(DigisellerConfigUpdatePanelArgs.name)
export class DigisellerConfigUpdatePanelArgs implements Omit<Prisma.DigisellerConfigUncheckedUpdateInput, 'regionFieldValues' | 'regions'> {
	@StringField({ nullable: true })
	apiKey: Nullable<string>;

	@TypedField(() => TranslationDto)
	editionSelectionFieldName: PrismaJson.TranslationType;

	@TypedField(() => TranslationDto)
	profileLinkFieldName: PrismaJson.TranslationType;

	@TypedField(() => TranslationDto)
	regionFieldName: PrismaJson.TranslationType;

	@IdField({ nullable: true })
	sellerId: Nullable<number>;

	@StringField({ isArray: true })
	@ArrayMaxSize(30)
	@ArrayUnique((o) => o)
	regions: string[];
}
