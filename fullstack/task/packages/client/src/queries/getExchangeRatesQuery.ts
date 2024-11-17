import { gql } from '@apollo/client';

export const getExchangeRatesQuery = gql`
    query GetExchangeRates {
        exchangeRates {
            data {
                country
                currency
                code
                amount
                rate
            }
            timestamp
        }
    }
`;
