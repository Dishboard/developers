import { gql } from '@apollo/client';

export const GET_EXCHANGE_RATES = gql`
    query GetExchangeRates {
        getExchangeRates {
            country
            currency
            amount
            code
            rate
            updatedAtUtc
        }
    }
`;

export interface ExchangeRateRecord {
    country: string;
    currency: string;
    amount: number;
    code: string;
    rate: string;
    updatedAtUtc: string;
}

export interface GET_EXCHANGE_RATES_RESPONSE {
    getExchangeRates: ExchangeRateRecord[];
}
