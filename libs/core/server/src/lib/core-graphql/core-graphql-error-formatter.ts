import { CoreErrorsEnum } from '@libs/core/common';
import { Logger } from '@nestjs/common';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

export function CoreGraphqlErrorFormatter(err: GraphQLError, logger: Logger): GraphQLFormattedError {
	const message = err.message;

	if (err?.extensions?.code === 'INTERNAL_SERVER_ERROR') {
		if (err.extensions?.['errors']) {
			return {
				message,
				extensions: {
					code: CoreErrorsEnum.ValidationError,
					validationErrors: err?.extensions['errors'],
					timestamp: new Date(),
				},
			};
		}

		if (err.message) {
			return {
				message: err.message,
				extensions: {
					code: CoreErrorsEnum.RequestError,
					timestamp: new Date(),
				},
			};
		}
	}

	if (err.extensions?.code === 'BAD_USER_INPUT' || err.extensions?.code === 'BAD_REQUEST') {
		return {
			message,
			extensions: {
				code: CoreErrorsEnum.RequestError,
				timestamp: new Date(),
			},
		};
	}

	return {
		message,
		extensions: {
			code: err.extensions?.code || CoreErrorsEnum.UnexpectedError,
			timestamp: new Date(),
		},
	};
}
