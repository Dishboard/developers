import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';

const { CURRENCY_API_ENDPOINT } = process.env;

@Injectable()
export class ExchangeRateService {
    constructor(
        @InjectRepository(ExchangeRate)
        private exchangeRateRepository: Repository<ExchangeRate>
    ) {}

    // Fetches the current date in Czech Republic
    private getCzechDate(): string {
        const czechTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Prague' });
        const currentDate = new Date(czechTime);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    // Checks if the data is older than 5 minutes
    private isDataOutdated(createdAt: Date): boolean {
        const FIVE_MINUTES = 5 * 60 * 1000;
        const now = new Date().getTime();
        const dataTime = new Date(createdAt).getTime();
        return now - dataTime > FIVE_MINUTES;
    }

    // Fetches data from the CNB API and stores it in the database
    public async fetchAndStoreExchangeRates(): Promise<void> {
        const currentDate = this.getCzechDate();

        try {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const response = await axios.get(CURRENCY_API_ENDPOINT!, {
                params: {
                    date: currentDate,
                    lang: 'EN',
                },
                headers: {
                    accept: 'application/json',
                },
            });

            const rates = response.data?.rates.map((rate: ExchangeRate) => ({
                country: rate.country,
                currency: rate.currency,
                amount: rate.amount,
                currencyCode: rate.currencyCode,
                rate: rate.rate,
            }));

            if (rates && rates.length > 0) {
                const operations = rates.map(async (rate: ExchangeRate) => {
                    const existingRate = await this.exchangeRateRepository.findOne({
                        where: { currencyCode: rate.currencyCode },
                    });

                    if (existingRate) {
                        return this.exchangeRateRepository.update(
                            { currencyCode: rate.currencyCode },
                            rate
                        );
                    }
                    const newRate = this.exchangeRateRepository.create(rate);
                    return this.exchangeRateRepository.save(newRate);
                });

                await Promise.all(operations);
            }
        } catch (error) {
            console.error('Error fetching and storing exchange rates:', error);
            throw new Error('Failed to fetch or store exchange rates.');
        }
    }

    // Retrieves exchange rates from the database for GraphQL query
    // If the data is outdated, it fetches and stores new data
    public async getExchangeRates(): Promise<ExchangeRate[]> {
        const lastUpdatedRate = await this.exchangeRateRepository.find({
            order: { updatedAtUtc: 'DESC' },
            take: 1,
        });

        const latestEntry = lastUpdatedRate.length > 0 ? lastUpdatedRate[0] : null;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!latestEntry || this.isDataOutdated(latestEntry.updatedAtUtc!)) {
            await this.fetchAndStoreExchangeRates();
        }

        return this.exchangeRateRepository.find({
            order: { country: 'ASC' },
        });
    }
}
