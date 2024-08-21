import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';
import { coreConfig } from '@libs/core/common';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
const token = Cookies.get(process.env.NX_JWT_COOKIE_NAME!);

const authLink = setContext((_, { headers }) => {
	const token = Cookies.get(process.env.NX_JWT_COOKIE_NAME!);

	if (!token && window.location.pathname === '/panel/login') {
		return {
			headers: {
				...headers,
				Authorization: token ? `Bearer ${token}` : undefined,
			},
		};
	}

	if (!token) {
		window.location.href = '/panel/login';
	}

	return {
		headers: {
			...headers,
			Authorization: token ? `Bearer ${token}` : undefined,
		},
	};
});

const httpLink = new HttpLink({
	uri: coreConfig.project.graphqlUrl,
});

const wsLink = new GraphQLWsLink(
	createClient({
		url: coreConfig.project.graphqlSubUrl,
		connectionParams: {
			authorization: `Bearer ${token}`,
		},
	}),
);

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
	wsLink,
	authLink.concat(httpLink),
);

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
});

export default client;
