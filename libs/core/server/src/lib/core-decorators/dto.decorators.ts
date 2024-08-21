import { ExposeNested } from '@libs/core/common';
import { GraphQLTranslations } from '@libs/core/server/lib/core-graphql/core-graphql-types';
import { TranslationDto } from '../core-dto/translation.dto';
import {
	Field,
	FieldOptions,
	Float,
	InputType,
	InputTypeOptions,
	Int,
	ObjectType,
	ObjectTypeOptions,
	registerEnumType,
	ReturnTypeFunc,
} from '@nestjs/graphql';
import { Expose, ExposeOptions, Transform, Type, TypeHelpOptions, TypeOptions } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLUpload } from 'graphql-upload-ts';

export interface PrimitiveOptions extends FieldOptions {
	isArray?: boolean;
	isArrayAppiled?: boolean;
	expose?: ExposeOptions;
	classTransformerOptions?: TypeOptions;
	field?: any;
	typeGraphqlType?: ReturnTypeFunc;
	isHidden?: boolean;

	classTransformerType?(type?: TypeHelpOptions): any;

	exposeNested?: boolean;
}

export function TypedField(classTransformerType: (() => any) | null, options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	if (!options) {
		options = {};
	}
	if (classTransformerType) {
		if (!options?.classTransformerType) {
			options.classTransformerType = classTransformerType;
		}
		if (!options?.typeGraphqlType) {
			if (options.isArray) {
				options.typeGraphqlType = (): [any] => [classTransformerType()];
			} else {
				options.typeGraphqlType = classTransformerType;
			}
		}
	}
	const exposeFn = options?.exposeNested
		? ExposeNested({
				...options?.expose,
				name: options.name,
		  })
		: Expose({
				...options?.expose,
				name: options.name,
		  });
	const typeFn = Type(options?.classTransformerType, options?.classTransformerOptions);
	const fieldFn = Field(options?.typeGraphqlType, {
		...options?.field,
		nullable: options?.nullable,
	});
	const isOptionalFn = IsOptional({ each: !!options.isArray });

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		if (options?.nullable) {
			isOptionalFn(target, propertyKey);
		}
		exposeFn(target, propertyKey);
		typeFn(target, propertyKey);
		fieldFn(target, propertyKey);
	};
}

export function PrimitiveField(
	options?: PrimitiveOptions & {
		exposeNested?: boolean;
	},
): (target: any, propertyKey: string) => void {
	if (!options) {
		options = {};
	}
	if (options.typeGraphqlType && options.isArray && !options.isArrayAppiled) {
		const typeGraphqlType = options!.typeGraphqlType!();
		options.typeGraphqlType = () => [typeGraphqlType];
		options.isArrayAppiled = true;
	}
	const exposeFn = options?.exposeNested
		? ExposeNested({
				...options?.expose,
				name: options.name,
		  })
		: Expose({
				...options?.expose,
				name: options.name,
		  });
	const fieldFn = Field(options?.typeGraphqlType, {
		...options?.field,
		nullable: options?.nullable,
	});
	const isOptionalFn = IsOptional({ each: !!options.isArray });

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		if (options?.nullable) {
			isOptionalFn(target, propertyKey);
		}
		exposeFn(target, propertyKey);
		fieldFn(target, propertyKey);
	};
}

export function EnumField(
	enumType: any,
	enumName: string,
	options?: PrimitiveOptions & {
		description?: string;
		exposeNested?: boolean;
	},
): (target: any, propertyKey: string) => void {
	registerEnumType(enumType, {
		name: `${enumName}Type`,
		description: options?.description,
	});

	const primitiveFieldFn = PrimitiveField({
		typeGraphqlType: () => enumType,
		...options,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function IdField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = PrimitiveField({
		typeGraphqlType: () => Int,
		...options,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function UUIDField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = PrimitiveField({
		typeGraphqlType: () => String,
		...options,
	});
	const isUUIDFn = IsUUID('4', { each: !!options?.isArray });

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
		isUUIDFn(target, propertyKey);
		if (options?.nullable) {
			const transformFn = Transform((params) => (!params.value ? undefined : params.value));
			transformFn(target, propertyKey);
		}
	};
}

export function DateField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = PrimitiveField({
		typeGraphqlType: () => Date,
		...options,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function BooleanField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = PrimitiveField({
		typeGraphqlType: () => Boolean,
		...options,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function StringField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = PrimitiveField({
		typeGraphqlType: () => String,
		...options,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function NumberField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = PrimitiveField({
		typeGraphqlType: () => Int,
		...options,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function FloatField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = PrimitiveField({
		typeGraphqlType: () => Float,
		...options,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function JsonField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = TypedField(null, {
		...options,
		exposeNested: true,
		typeGraphqlType: () => GraphQLJSON,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function TranslateField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = TypedField(null, {
		...options,
		exposeNested: true,
		typeGraphqlType: () => GraphQLTranslations,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function UploadField(options?: PrimitiveOptions): (target: any, propertyKey: string) => void {
	const primitiveFieldFn = TypedField(null, {
		...options,
		exposeNested: true,
		typeGraphqlType: () => GraphQLUpload,
	});

	return (target: any, propertyKey: string): void => {
		if (options?.isHidden) return;
		primitiveFieldFn(target, propertyKey);
	};
}

export function DtoType(
	name: string,
	options?: {
		inputType?: InputTypeOptions;
		objectType?: ObjectTypeOptions;
	},
): (target: any) => void {
	const inputTypeFn = InputType(`Input${name}`, options?.inputType);
	const objectTypeFn = ObjectType(`Object${name}`, options?.objectType);

	return (target: any): void => {
		inputTypeFn(target);
		objectTypeFn(target);
	};
}
