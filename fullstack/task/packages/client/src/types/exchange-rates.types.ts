export interface ExchangeRate {
    id: number;
    amount: number;
    rate: number;
    country: string;
    currencyCode: string;
    createdAtUtc: number;
}
