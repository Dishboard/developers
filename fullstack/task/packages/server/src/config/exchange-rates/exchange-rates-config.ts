import { config } from 'dotenv';

config();

const {
    EXCHANGE_RATE_API_URL: exchangeRateApi,
} = process.env;

export const exchangeRateConfig = {
    apiUrl: exchangeRateApi,
};
