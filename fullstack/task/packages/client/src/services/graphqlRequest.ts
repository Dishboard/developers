import { GRAPHQL_ENDPOINT } from '../config';

export const graphqlRequest = async <T>(
    query: string,
    variables: Record<string, unknown> = {}
): Promise<T | null> => {
    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            return null;
        }

        return result.data as T;
    } catch (error) {
        console.error('Error making GraphQL request:', error);
        return null;
    }
};
