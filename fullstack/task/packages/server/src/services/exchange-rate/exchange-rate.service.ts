import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../../entities/exchangeRate.entity';
import { ExchangeRateRepository } from './exchange-rate.repository';
import { Rate } from './types/rate';

@Injectable()
export class ExchangeRateService {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: ExchangeRateRepository
    ) {}
    private getRatesFromApi = async (): Promise<ExchangeRate[]> => {
        try {
            let date = new Date();
            const offset = date.getTimezoneOffset();
            date = new Date(date.getTime() - offset * 60 * 1000);
            const formattedDate = date.toISOString().split('T')[0];

            const response = await fetch(
                `https://api.cnb.cz/cnbapi/exrates/daily?date=${formattedDate}&lang=EN`
            );
            const data = await response.json();
            return data.rates.map((rate: Rate) => {
                const exchangeRate = new ExchangeRate();
                exchangeRate.validFor = new Date(rate.validFor);
                exchangeRate.order = rate.order;
                exchangeRate.country = rate.country;
                exchangeRate.currency = rate.currency;
                exchangeRate.amount = rate.amount;
                exchangeRate.currencyCode = rate.currencyCode;
                exchangeRate.rate = rate.rate;
                return exchangeRate;
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    };

    private async cacheIsValid(): Promise<boolean> {
        const latestEntry = await this.exchangeRateRepository.find({
            order: { createdAtUtc: 'DESC' },
            take: 1,
        });
        if (latestEntry.length === 0) return false;

        const age = new Date().getTime() - latestEntry[0].createdAtUtc.getTime();
        return age < 5 * 60 * 1000;
    }

    private async saveRates(rates: ExchangeRate[]) {
        await this.exchangeRateRepository.delete({});
        return this.exchangeRateRepository.save(rates);
    }

    public getExchangeRates = async (): Promise<ExchangeRate[]> => {
        if (await this.cacheIsValid()) {
            return await this.exchangeRateRepository.find();
        }
        const rates = await this.getRatesFromApi();
        return await this.saveRates(rates);
    };
}
