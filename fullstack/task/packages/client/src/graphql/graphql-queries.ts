import { gql } from '@apollo/client';

export const EXCHANGE_RATES_QUERY = gql`
    query GetExchangeRates($language: String!) {
        exchangeRates(language: $language) {
            rates {
                id
                currency
                rate
                amount
                country
                validFor
                currencyCode
            }
            timestamp
            cached
        }
    }
`;
