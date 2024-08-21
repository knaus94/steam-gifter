import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { AuthTokenPayload } from '@libs/auth/server';
import { Nullable } from '@libs/core/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import { getClientIp } from '@supercharge/request-ip';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { CoreConfig } from '../core-configs/core.config';
import { CoreGraphqlErrorFormatter } from './core-graphql-error-formatter';
import { CORE_GRAPHQL_TYPES } from './core-graphql-types';

export function getGraphQLBasicOptions(logger: Logger, { graphql, production }: CoreConfig): ApolloDriverConfig {
	return {
		driver: ApolloDriver,
		formatError: (error: GraphQLError): GraphQLFormattedError => CoreGraphqlErrorFormatter(error, logger),
		autoSchemaFile: graphql.autoSchemaFilePath,
		playground: false,
		introspection: !production,
		resolvers: CORE_GRAPHQL_TYPES,
		plugins: !production
			? [
					ApolloServerPluginLandingPageLocalDefault({
						embed: {
							runTelemetry: false,
							initialState: {
								pollForSchemaUpdates: false,
							},
						},
					}),
			  ]
			: undefined,
		context: ({ req, res, extra, connectionParams }) => {
			if (connectionParams) {
				return {
					req: {
						headers: { ...(connectionParams ? connectionParams : {}) },
						ip: getClientIp(extra?.request),
					},
				};
			}

			if (!req['ip']) req['ip'] = getClientIp(req);

			return {
				req,
				res,
			};
		},
		subscriptions: {
			'graphql-ws': {
				onSubscribe: (ctx, { payload }) => {
					let userId: Nullable<string> = null;
					const token = ctx?.connectionParams?.authorization as string;
					if (token) {
						try {
							userId = (
								JSON.parse(Buffer.from(token.split(' ')[1].split('.')[1], 'base64').toString()) as AuthTokenPayload
							).sub.toString();
						} catch (error) {}
					}

					logger.log(`${payload?.operationName ?? null} ${JSON.stringify(payload?.variables)} [userId: ${userId}]`);
				},
			},
		},
	} satisfies ApolloDriverConfig;
}
