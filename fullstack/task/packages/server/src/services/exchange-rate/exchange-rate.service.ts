import { Injectable } from '@nestjs/common';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { IExchangeRateRepository } from './exchange-rate.repository';
import { CNBService, ExchangeRateResponseBody } from './cnb.service';

@Injectable()
export class ExchangeRateService {
    private CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    constructor(
        private readonly exchangeRateRepository: IExchangeRateRepository,
        private readonly cndService: CNBService) { }

    public async getExchangeRates(currencyCode?: string): Promise<ExchangeRate[]> {
        const latestRates = await this.exchangeRateRepository.getLatestRates(currencyCode);

        if (
            latestRates.length === 0 ||
            this.isCacheExpired(latestRates[0].createdAtUtc)
        ) {
            return await this.fetchAndCacheExchangeRates(currencyCode);
        }

        return latestRates;
    };

    private isCacheExpired(lastFetched: Date): boolean {
        const now = new Date().getTime();
        const lastFetchedTime = new Date(lastFetched).getTime();

        return now - lastFetchedTime > this.CACHE_DURATION_MS;
    }

    private async fetchAndCacheExchangeRates(currencyCode?: string): Promise<ExchangeRate[]> {
        const rawResponse = await this.cndService.getExchangeRatesFromCNB()

        let exchangeRates = this.transformResponseToEntity(rawResponse);

        await this.exchangeRateRepository.invalidateAll();
        await this.exchangeRateRepository.save(exchangeRates);

        if (currencyCode) {
            exchangeRates = exchangeRates.filter(rate => rate.currencyCode === currencyCode);
        }

        return exchangeRates;
    }

    private transformResponseToEntity(
        data: ExchangeRateResponseBody,
    ): ExchangeRate[] {
        return data.rates.map((rate) => this.exchangeRateRepository.create({
            validFor: new Date(rate.validFor),
            country: rate.country,
            currency: rate.currency,
            amount: rate.amount,
            currencyCode: rate.currencyCode,
            rate: rate.rate,
        }));
    }
}

export interface IExchangeRateService {
    getExchangeRates(currencyCode?: string): Promise<ExchangeRate[]>;
}
