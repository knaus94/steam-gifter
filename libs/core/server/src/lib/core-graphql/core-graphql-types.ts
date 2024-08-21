import { dateToString, LangEnum, stringToDate } from '@libs/core/common';
import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

function convertStringToDate(dateString: string) {
	try {
		return stringToDate(dateString);
	} catch {
		throw new Error('Provided date string is invalid and cannot be parsed');
	}
}

export const GraphQLISODateTime = new GraphQLScalarType({
	name: 'DateTime',
	description: 'The javascript `Date` as string. Type represents date and time as the ISO Date string.',
	serialize(value: unknown) {
		if (!value) {
			return value;
		}

		if (!(value instanceof Date)) {
			throw new Error(`Unable to serialize value '${JSON.stringify(value)}' as it's not an instance of 'Date'`);
		}

		return dateToString(value);
	},
	parseValue(value: unknown) {
		if (typeof value !== 'string') {
			throw new Error(`Unable to parse value '${JSON.stringify(value)}' as GraphQLISODateTime scalar supports only string values`);
		}

		return convertStringToDate(value);
	},
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			throw new Error(
				`Unable to parse literal value of kind '${ast.kind}' as GraphQLISODateTime scalar supports only '${Kind.STRING}' ones`,
			);
		}

		return convertStringToDate(ast.value);
	},
});

export const GraphQLTranslations = new GraphQLScalarType({
	name: 'Translations',
	description:
		'The `Translations` Scalar type is used in GraphQL to represent a key-value pair where the key is a `String` representing a language code, and the value is also a `String`. This type of data is commonly used to store and transmit translations of text fragments into different languages.',

	parseValue(value: Record<LangEnum, string>): Record<LangEnum, string> {
		return value;
	},
	serialize(value: Record<LangEnum, string>): { [key in LangEnum]: string } {
		const formattedValue = {} as { [key in LangEnum]: string };
		Object.values(LangEnum).forEach((lang) => {
			formattedValue[lang] = value[lang] || '';
		});
		return formattedValue;
	},
	parseLiteral(ast: ValueNode): Record<LangEnum, string> {
		if (ast.kind !== Kind.OBJECT) {
			throw new Error(`MultiLang scalar can only parse object literals`);
		}

		const translations: Record<LangEnum, string> = {} as Record<LangEnum, string>;
		Object.values(LangEnum).forEach((lang) => {
			translations[lang] = '';
		});

		ast.fields.forEach((field) => {
			if (field.value.kind === Kind.STRING && LangEnum[field.name.value]) {
				translations[field.name.value] = field.value.value;
			}
		});

		return translations;
	},
});

export const CORE_GRAPHQL_TYPES = {
	// DateTime: GraphQLISODateTime,
	Translations: GraphQLTranslations,
};
