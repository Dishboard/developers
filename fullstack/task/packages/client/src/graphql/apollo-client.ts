import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://0.0.0.0:4001/graphql',
    }),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    exchangeRates: {
                        merge(existing, incoming) {
                            return existing?.timestamp === incoming.timestamp ? existing : incoming;
                        },
                    },
                },
            },
        },
    }),
});
