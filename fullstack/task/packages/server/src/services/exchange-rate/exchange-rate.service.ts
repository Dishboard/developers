import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateService {
    private readonly logger = new Logger(ExchangeRate.name);

    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>
    ) {}

    @Cron('*/5 * * * *') // Runs every 5 minutes
    public async fetchAndSaveExchangeRates(): Promise<void> {
        try {
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            // eslint-disable-next-line max-len
            const url = `https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt?date=${day}.${month}.${year}`;

            const response = await axios.get(url);
            const data = this.parseExchangeRates(response.data);
            await this.saveExchangeRates(data);
            this.logger.log('Exchange rates fetched and saved successfully');
        } catch (error) {
            this.logger.error('Error fetching or saving exchange rates:', error);
        }
    }

    public async getExchangeRates(): Promise<ExchangeRate[]> {
        const rates = await this.exchangeRateRepository.find();
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        if (rates.length === 0 || new Date(rates[0].updatedAt) < fiveMinutesAgo) {
            await this.fetchAndSaveExchangeRates();
            return this.exchangeRateRepository.find();
        }
        return rates;
    }

    private parseExchangeRates(data: string): ExchangeRate[] {
        const lines = data.split('\n');
        const header = lines[1].split('|');
        const exchangeRates = [];

        for (let i = 2; i < lines.length - 1; i++) {
            const line = lines[i].split('|');
            const exchangeRate: any = {};
            for (let j = 0; j < header.length; j++) {
                exchangeRate[header[j].toLocaleLowerCase()] = line[j];
            }

            exchangeRates.push(exchangeRate);
        }
        return exchangeRates;
    }

    private async saveExchangeRates(exchangeRates: ExchangeRate[]): Promise<void> {
        await Promise.all(
            exchangeRates.map(async (rate) => {
                const data = {
                    ...rate,
                    updatedAt: new Date().toISOString(),
                };

                const existingRate = await this.exchangeRateRepository.findOne({
                    where: { code: rate.code },
                });

                if (existingRate) {
                    await this.exchangeRateRepository.update(existingRate.id, data);
                } else {
                    await this.exchangeRateRepository.save(data);
                }
            })
        );
    }
}
