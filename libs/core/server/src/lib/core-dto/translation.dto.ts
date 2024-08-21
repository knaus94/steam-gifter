import { NullTransform } from '../core-decorators/null-transform.decorators';
import { DtoType, StringField } from '../core-decorators/dto.decorators';

@DtoType(TranslationDto.name)
export class TranslationDto implements Required<PrismaJson.TranslationType> {
	@StringField({ nullable: true })
	@NullTransform()
	en: string;

	@StringField({ nullable: true })
	@NullTransform()
	ru: string;
}
