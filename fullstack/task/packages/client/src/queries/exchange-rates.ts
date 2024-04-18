import { gql } from '@apollo/client';

export const GET_EXCHANGE_RATES = gql`
    query {
        exchangeRates {
            country
            currency
            amount
            currencyCode
            rate
            createdAtUtc
        }
    }
`;
