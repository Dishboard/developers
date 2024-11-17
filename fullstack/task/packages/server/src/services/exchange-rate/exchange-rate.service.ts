import { HttpException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import axios, { HttpStatusCode } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ExchangeRateResponse } from './dto/exchange-rate-response.dto';
import { ExchangeRateRepository } from './exchangeRate.repository';
import { ExchangeRate } from './entities';

interface CurrencyData {
    country: string;
    currency: string;
    amount: string;
    code: string;
    rate: string;
}

@Injectable()
export class ExchangeRateService implements OnApplicationBootstrap {
    private readonly cacheLifetime = 5 * 60 * 1000;
    private readonly exchangeRatesUrl =
        'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/' +
        'central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';

    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: ExchangeRateRepository,
        private schedulerRegistry: SchedulerRegistry
    ) {}

    public getExchangeRates = async (): Promise<ExchangeRateResponse> => {
        const count = await this.exchangeRateRepository.count();
        if (count === 0) {
            const res = await this.fetchTextFile(this.exchangeRatesUrl);
            const parsedRes = this.parseRawExchangeRateData(res);
            const newRates = parsedRes.map((rate) => this.exchangeRateRepository.create(rate));
            await this.exchangeRateRepository.save(newRates);
            this.scheduleExchangeRatesCleanup(this.cacheLifetime);
            return { data: newRates, timestamp: new Date().toISOString() };
        }
        const data = await this.exchangeRateRepository.find();
        return { data, timestamp: data[0].createdAtUtc.toISOString() };
    };

    // resolves problem when server is shut down before cleanup
    onApplicationBootstrap() {
        this.exchangeRateRepository.clear();
    }

    private scheduleExchangeRatesCleanup(delay: number) {
        const taskName = 'exchange-rates-cleanup';

        const existingTimeout = this.schedulerRegistry.getTimeouts().find((t) => t === taskName);
        if (existingTimeout) {
            this.schedulerRegistry.deleteTimeout(taskName);
        }

        const timeout = setTimeout(() => {
            this.exchangeRateRepository.clear();
            this.schedulerRegistry.deleteTimeout(taskName);
        }, delay);

        this.schedulerRegistry.addTimeout(taskName, timeout);
    }

    async fetchTextFile(url: string): Promise<string> {
        try {
            const response = await axios.get(url, { responseType: 'text' });
            return response.data;
        } catch (error) {
            throw new HttpException(
                'Failed to fetch exchange rate data',
                HttpStatusCode.ServiceUnavailable
            );
        }
    }

    private parseRawExchangeRateData(data: string): CurrencyData[] {
        const lines = data.trim().split('\n');
        const rows: string[] = lines.slice(2);

        const parsedRows: CurrencyData[] = rows.map((row) => {
            const values = row.split('|').map((value) => value.trim());
            return {
                country: values[0],
                currency: values[1],
                amount: values[2],
                code: values[3],
                rate: values[4],
            };
        });

        return parsedRows;
    }
}
