import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateService {
    constructor(
        @InjectRepository(ExchangeRate)
        private exchangeRateRepository: Repository<ExchangeRate>,
    ) {}

    // Fetches the current date in Czech Republic
    private getCzechDate(): string {
        const czechTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Prague" });
        const currentDate = new Date(czechTime);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Fetches data from the CNB API and stores it in the database
    public async fetchAndStoreExchangeRates(): Promise<void> {
        const currentDate = this.getCzechDate();

        try {
            const response = await axios.get(`https://api.cnb.cz/cnbapi/exrates/daily`, {
                params: {
                    date: currentDate,
                    lang: 'EN',
                },
                headers: {
                    'accept': 'application/json',
                },
            });

            const rates = response.data?.rates.map((rate: ExchangeRate) => ({
                country: rate.country,
                currency: rate.currency,
                amount: rate.amount,
                currencyCode: rate.currencyCode,
                rate: rate.rate,
            }));

            for (const rate of rates) {
                const existingRate = await this.exchangeRateRepository.findOne({ where: { currencyCode: rate.currencyCode } });

                if (existingRate) {
                    await this.exchangeRateRepository.update({ currencyCode: rate.currencyCode }, rate);
                } else {
                    const newRate = this.exchangeRateRepository.create(rate);
                    await this.exchangeRateRepository.save(newRate);
                }
            }
        } catch (error) {
            console.error('Error fetching and storing exchange rates:', error);
            throw new Error('Failed to fetch or store exchange rates.');
        }
    }

    // Retrieves exchange rates from the database for GraphQL query
    public async getExchangeRates(): Promise<ExchangeRate[]> {
        await this.fetchAndStoreExchangeRates();
        return await this.exchangeRateRepository.find();
    }
}
