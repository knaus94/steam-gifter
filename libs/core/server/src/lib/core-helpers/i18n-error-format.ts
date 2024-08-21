import { I18nService, I18nValidationError, Path, TranslateOptions } from 'nestjs-i18n';

export function formatI18nErrors<K = Record<string, unknown>>(
	errors: I18nValidationError[],
	i18n: I18nService<K>,
	options?: TranslateOptions,
): I18nValidationError[] {
	return errors.map((error) => {
		error.children = formatI18nErrors(error.children ?? [], i18n, options);
		try {
			error.constraints = Object.keys(error.constraints!).reduce((result, key) => {
				const value = error.constraints![key];
				const separatorIndex = value.indexOf('|');
				const translationKey = value.substring(0, separatorIndex);
				const argsString = value.substring(separatorIndex + 1);
				const args = argsString ? JSON.parse(argsString) : {};
				result[key] = i18n.translate(translationKey as Path<K>, {
					...options,
					args: { property: error.property, ...args },
				});
				return result;
			}, {});
		} catch (e) {}

		return error;
	});
}
