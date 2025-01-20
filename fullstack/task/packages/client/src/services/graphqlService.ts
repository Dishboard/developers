import axios from 'axios';

const GRAPHQL_ENDPOINT = 'http://localhost:4001/graphql';

export interface CurrencyRate {
    country: string;
    currency: string;
    currencyCode: string;
    createdAtUtc: string;
    amount: number;
    rate: number;
}

export const fetchCurrencyRates = async () => {
    const query = `
    query {
       exchangeRates {
            country
            currency
            currencyCode
            createdAtUtc
            rate
            amount
        }
    }
  `;

    try {
        const response = await axios.post(GRAPHQL_ENDPOINT, { query });
        return response.data.data.exchangeRates;
    } catch (error) {
        console.error('Error fetching currency rates:', error);
        throw error;
    }
};

