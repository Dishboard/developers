import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ExchangeRate } from '../../entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateService {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>
    ) {}

    private CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
    private lastFetchTime: number | null = null;
    private EXCHANGE_RATE_API_URL: string = process.env.EXCHANGE_RATE_API_URL || '';

    /**
     * Returns the exchange rates and the last fetch time.
     */
    public async getExchangeRates(): Promise<{ rates: ExchangeRate[]; lastFetched: Date | null }> {
        const now = Date.now();

        // If cache is valid, return cached rates
        if (this.lastFetchTime && now - this.lastFetchTime < this.CACHE_TTL) {
            const rates = await this.exchangeRateRepository.find();
            return { rates, lastFetched: new Date(this.lastFetchTime) };
        }

        try {
            // Fetch new rates from the bank
            const exchangeRates = await this.fetchExchangeRatesFromBank();

            // Clear and update the repository with fresh data
            await this.exchangeRateRepository.clear();
            await this.exchangeRateRepository.save(exchangeRates);

            // Update the fetch time
            this.lastFetchTime = now;

            return { rates: exchangeRates, lastFetched: new Date(this.lastFetchTime) };
        } catch (error) {
            console.error('Error in fetching exchange rates:', error.message);
            throw new Error('Unable to fetch exchange rates. Please try again later.');
        }
    }

    /**
     * Fetches exchange rates from the Czech National Bank.
     */
    private async fetchExchangeRatesFromBank(): Promise<ExchangeRate[]> {
        try {
            const response = await axios.get(this.EXCHANGE_RATE_API_URL);
            const lines = response.data.split('\n');

            return lines
                .slice(2) // Skip the header lines
                .filter((line: string) => line.trim() && line.split('|').length === 5)
                .map((line: string) => {
                    const parts = line.split('|');
                    return {
                        country: parts[0].trim(),
                        currency: parts[1].trim(),
                        amount: parseFloat(parts[2].trim()),
                        code: parts[3].trim(),
                        rate: parseFloat(parts[4].trim().replace(',', '.')),
                    } as ExchangeRate;
                });
        } catch (error) {
            console.error('Error in fetching rates from bank:', error.message);
            throw new Error('Failed to fetch exchange rates from the Czech National Bank.');
        }
    }
}
