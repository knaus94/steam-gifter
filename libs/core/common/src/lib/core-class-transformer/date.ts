import { TransformFnParams } from 'class-transformer';

export function stringToDate(value: Date | string | undefined | null): Date | null {
	if (value) {
		return new Date(new Date(value).getTime());
	}

	return null;
}

export function dateToString(value: Date | undefined | null): string | null {
	return value ? value.toISOString().slice(0, -1) : null;
}

export function transformStringToDate(params: TransformFnParams): Date | null {
	if (params.value) {
		return stringToDate(params.value);
	}

	return null;
}

export function transformDateToString(params: TransformFnParams): string | null {
	return params.value ? dateToString(params.value) : null;
}
