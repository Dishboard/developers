import { gql } from '@apollo/client';

export const GET_EXCHANGE_RATES = gql`
  query {
    exchangeRates {
      rate
      currency
      country
      amount
      code
      updatedAtUtc
    }
  }
`;
