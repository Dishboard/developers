import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import axios from 'axios';
import { ExchangeRate } from '../../entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateService {
    private readonly logger = new Logger(ExchangeRateService.name);
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
    private readonly CNB_URL =
        // eslint-disable-next-line max-len
        'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';

    constructor(
        @InjectRepository(ExchangeRate)
        private exchangeRateRepository: Repository<ExchangeRate>
    ) {}

    async getExchangeRates(): Promise<ExchangeRate[]> {
        // Check cache first
        const latestRates = await this.getLatestFromCache();
        if (latestRates.length > 0) {
            return latestRates;
        }

        // If cache is empty or expired, fetch new data
        return this.fetchAndCacheRates();
    }

    private async getLatestFromCache(): Promise<ExchangeRate[]> {
        const cacheExpiration = new Date(Date.now() - this.CACHE_DURATION);

        return this.exchangeRateRepository.find({
            where: {
                lastUpdated: MoreThan(cacheExpiration),
            },
            order: {
                lastUpdated: 'DESC',
            },
        });
    }

    private async fetchAndCacheRates(): Promise<ExchangeRate[]> {
        try {
            const response = await axios.get(this.CNB_URL);
            const rates = this.parseRatesData(response.data);

            // Clear old rates
            await this.exchangeRateRepository.clear();

            // Save new rates
            const savedRates = await this.exchangeRateRepository.save(rates);
            return savedRates;
        } catch (error) {
            this.logger.error('Failed to fetch exchange rates', error);
            throw new Error('Failed to fetch exchange rates');
        }
    }

    private parseRatesData(data: string): Partial<ExchangeRate>[] {
        const lines = data.split('\n');
        const currentDate = new Date();

        // Skip first two lines (header and column names)
        return lines
            .slice(2)
            .filter((line) => line.trim())
            .map((line) => {
                const [country, currency, amount, code, rate] = line.split('|');

                return {
                    country: country.trim(),
                    currency: currency.trim(),
                    amount: parseFloat(amount),
                    code: code.trim(),
                    rate: parseFloat(rate),
                    lastUpdated: currentDate,
                };
            });
    }
}
