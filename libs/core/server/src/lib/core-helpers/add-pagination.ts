import { ClassType } from 'graphql-composer';
import { DtoType, NumberField, TypedField } from '../core-decorators/dto.decorators';

export function ClassTransformToPaginationClass<TItem>(TItemClass: ClassType<TItem>) {
	@DtoType(AddPaginationClass.name)
	abstract class AddPaginationClass {
		@TypedField(() => TItemClass, { isArray: true }) records: TItem[];

		@NumberField() total: number;
	}

	return AddPaginationClass;
}
