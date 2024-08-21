import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { DtoType, StringField } from '../core-decorators/dto.decorators';

@DtoType(OKDto.name)
export class OKDto {
	public static OK = 'OK';

	@StringField() @ApiProperty({ type: String, default: OKDto.OK }) @Transform(() => OKDto.OK) result: typeof OKDto.OK;

	constructor() {
		this.result = OKDto.OK;
	}
}
