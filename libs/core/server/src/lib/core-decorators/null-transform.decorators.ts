import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export function NullTransform(): PropertyDecorator {
	return (target: object, propertyKey: string | symbol) => {
		Transform(({ value }) => value ?? undefined)(target, propertyKey);
		IsOptional()(target, propertyKey);
	};
}
