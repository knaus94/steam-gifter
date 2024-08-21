import { IsInt, Max, Min } from 'class-validator';
import { DtoType, NumberField } from '../core-decorators/dto.decorators';

@DtoType(PaginationArgs.name)
export class PaginationArgs {
	@NumberField({ defaultValue: 0 })
	@IsInt()
	skip: number;

	@NumberField({ defaultValue: 10 })
	@IsInt()
	@Max(20)
	@Min(1)
	take: number;
}
