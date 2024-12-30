import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { ExchangeRate } from '../../entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateService {
    private cacheLifetimeInMinutes = 5;
    private exchangeRatesApiUrl = `https://api.cnb.cz/cnbapi/exrates`;

    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>
    ) {}

    public getExchangeRates = async (): Promise<ExchangeRate[]> => {
        const cachedRates = await this.getCachedRates();

        if (cachedRates?.length) {
            return cachedRates;
        }

        const response = await axios.get(`${this.exchangeRatesApiUrl}/daily`);

        const exchangeRates: ExchangeRate[] = response.data.rates.map((rate: any) => ({
            validFor: rate.validFor,
            order: rate.order,
            country: rate.country,
            currency: rate.currency,
            amount: rate.amount,
            currencyCode: rate.currencyCode,
            rate: rate.rate,
        }));

        await this.saveExchangeRates(exchangeRates);

        const rates = await this.exchangeRateRepository.find();

        return rates;
    };

    private saveExchangeRates = async (exchangeRates: ExchangeRate[]): Promise<void> => {
        await this.exchangeRateRepository.delete({});
        await this.exchangeRateRepository.save(exchangeRates);
    };

    private getCachedRates = async (): Promise<ExchangeRate[] | null> => {
        const cacheExpirationTime = new Date();

        cacheExpirationTime.setMinutes(
            cacheExpirationTime.getMinutes() - this.cacheLifetimeInMinutes
        );

        const cachedRates = await this.exchangeRateRepository.find({
            where: {
                createdAtUtc: MoreThanOrEqual(cacheExpirationTime),
            },
        });

        return cachedRates || null;
    };
}
