import { gql } from "@apollo/client";

export const EXCHANGE_RATES_QUERY = gql`
query {
    exchangeRates {
        id
        amount
        rate
        country
        currencyCode
        createdAtUtc
    }
}
`;