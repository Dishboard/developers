import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from 'src/entities/exchange-rates.entity';

@Injectable()
export class ExchangeRateService {
    private readonly CACHE_LIFETIME_MS = 5 * 60 * 1000; // 5 minutes

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,

        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>
    ) {}

    public getExchangeRates = async (): Promise<ExchangeRate[]> => {
        const now = new Date();
        const oldestAllowedTime = new Date(now.getTime() - this.CACHE_LIFETIME_MS);

        // Check if cached data is still valid
        const latestRate = await this.exchangeRateRepository.findOne({
            where: {},
            order: { updatedAtUtc: 'DESC' },
        });

        if (latestRate && latestRate.updatedAtUtc && latestRate.updatedAtUtc > oldestAllowedTime) {
            console.log('Returning cached exchange rates from the database');
            return await this.getExchangeRatesFromDB();
        }

        // Fetch new data from the API
        console.log('Fetching new exchange rates from the API');
        const apiUrl = this.configService.get<string>('exchangeRate.apiUrl') || '';

        try {
            const response = await firstValueFrom(this.httpService.get(apiUrl));
            console.log('API Response:', response.data);

            const rates = this.parseExchangeRates(response.data);
            await this.saveExchangeRatesToDB(rates);

            console.log('Exchange rates updated successfully');
            return rates;
        } catch (err) {
            console.error('Error fetching exchange rates:', err);
            throw new Error('Failed to fetch exchange rates from the API');
        }
    };

    private getExchangeRatesFromDB = async (): Promise<ExchangeRate[]> => {
        const rates = await this.exchangeRateRepository.find();
        if (!rates || rates.length === 0) {
            throw new NotFoundException('No exchange rates found in the database');
        }
        return rates;
    };

    private parseExchangeRates = (data: string): ExchangeRate[] => {
        return data
            .split('\n')
            .slice(2) 
            .filter(line => line.trim()) 
            .map(line => {
                const [country, currency, amount, code, rate] = line.split('|');
                return {
                    country: country.trim(),
                    currency: currency.trim(),
                    amount: parseInt(amount, 10),
                    code: code.trim(),
                    rate: parseFloat(rate),
                } as ExchangeRate;
            })
    };

    private saveExchangeRatesToDB = async (rates: ExchangeRate[]): Promise<void> => {
        await this.exchangeRateRepository.clear();

        await this.exchangeRateRepository.save(rates);
    };
}
