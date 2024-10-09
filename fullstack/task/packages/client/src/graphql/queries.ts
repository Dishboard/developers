// src/queries.ts
import { gql } from '@apollo/client';

export const GET_EXCHANGE_RATES = gql`
    query GetExchangeRates {
        exchangeRates {
            id
            country
            currency
            amount
            currencyCode
            rate
            updatedAtUtc
        }
    }
`;
