import { gql } from 'graphql-tag';

export const GET_EXCHANGE_RATES = gql`
    query GetExchangeRates($lang: String!) {
        exchangeRates(lang: $lang) {
            value {
                country
                currency
                rate
                amount
                currencyCode
            }
            createdAt
        }
    }
`;

