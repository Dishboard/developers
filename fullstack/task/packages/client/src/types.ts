export type ExchangeRate = {
    id: string;
    currency: string;
    rate: number;
    amount: number;
    country: string;
    validFor: string;
    currencyCode: string;
};

export type ExchangeRatesData = {
    exchangeRates: {
        rates: ExchangeRate[];
        timestamp: string;
        cached: boolean;
    };
};

export const languages = ['EN', 'CZ'] as const;

export type ExchangeRatesVars = {
    language: typeof languages[number];
};
