import { Expose, ExposeOptions, Transform, TransformFnParams } from 'class-transformer';

// for correct work expose with js object
// https://github.com/typestack/class-transformer/issues/365
export function ExposeNested(options?: ExposeOptions & { default?: any }): (target: any, propertyKey: string) => void {
	const exposeFn = Expose(options);
	const transformFn = (propertyKey: string): PropertyDecorator =>
		Transform((params: TransformFnParams) => {
			return (
				(params.obj && Object.getOwnPropertyDescriptor(params.obj, propertyKey) ? params.obj[propertyKey] : options?.default) ||
				params.value
			);
		});

	return (target: any, propertyKey: string): void => {
		transformFn(propertyKey)(target, propertyKey);
		exposeFn(target, propertyKey);
	};
}
