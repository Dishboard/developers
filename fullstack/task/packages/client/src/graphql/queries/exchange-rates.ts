import { gql } from '@apollo/client';

export interface ExchangeRate {
    validFor: string;
    order: number;
    country: string;
    currency: string;
    amount: number;
    currencyCode: string;
    rate: number;
}

export const GET_EXCHANGE_RATES = gql`
    query GetExchangeRates {
        exchangeRates {
            id
            validFor
            order
            country
            currency
            amount
            currencyCode
            rate
        }
    }
`;
