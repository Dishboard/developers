import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ExchangeRate = {
  __typename?: 'ExchangeRate';
  amount: Scalars['Float']['output'];
  code: Scalars['String']['output'];
  country: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  rate: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getExchangeRates: Array<ExchangeRate>;
};

export type ExchangeRatesQueryVariables = Exact<{ [key: string]: never; }>;


export type ExchangeRatesQuery = { __typename?: 'Query', getExchangeRates: Array<{ __typename?: 'ExchangeRate', country: string, rate: number, code: string, updatedAt: string, currency: string, amount: number }> };


export const ExchangeRatesDocument = gql`
    query ExchangeRates {
  getExchangeRates {
    country
    rate
    code
    updatedAt
    currency
    amount
  }
}
    `;

/**
 * __useExchangeRatesQuery__
 *
 * To run a query within a React component, call `useExchangeRatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useExchangeRatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExchangeRatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useExchangeRatesQuery(baseOptions?: Apollo.QueryHookOptions<ExchangeRatesQuery, ExchangeRatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExchangeRatesQuery, ExchangeRatesQueryVariables>(ExchangeRatesDocument, options);
      }
export function useExchangeRatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExchangeRatesQuery, ExchangeRatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExchangeRatesQuery, ExchangeRatesQueryVariables>(ExchangeRatesDocument, options);
        }
export function useExchangeRatesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ExchangeRatesQuery, ExchangeRatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ExchangeRatesQuery, ExchangeRatesQueryVariables>(ExchangeRatesDocument, options);
        }
export type ExchangeRatesQueryHookResult = ReturnType<typeof useExchangeRatesQuery>;
export type ExchangeRatesLazyQueryHookResult = ReturnType<typeof useExchangeRatesLazyQuery>;
export type ExchangeRatesSuspenseQueryHookResult = ReturnType<typeof useExchangeRatesSuspenseQuery>;
export type ExchangeRatesQueryResult = Apollo.QueryResult<ExchangeRatesQuery, ExchangeRatesQueryVariables>;