import { graphqlRequest } from './graphqlRequest';

export interface ExchangeRate {
    country: string;
    currency: string;
    amount: number;
    code: string;
    rate: number;
}

export interface ExchangeRatesResponse {
    exchangeRates: {
        rates: ExchangeRate[];
        lastFetched: string | null;
    };
}

export const fetchExchangeRates = async (): Promise<ExchangeRatesResponse | null> => {
    const query = `
        query {
            exchangeRates {
                rates {
                    country
                    currency
                    amount
                    code
                    rate
                }
                lastFetched
            }
        }
    `;

    return graphqlRequest<ExchangeRatesResponse>(query);
};
