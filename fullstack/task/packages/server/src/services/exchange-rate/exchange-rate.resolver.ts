import { Args, Query, Resolver } from '@nestjs/graphql';
import { isLanguage } from '../../entities';
import { ExchangeRateService } from './exchange-rate.service';
import { GetExchangeRatesResult } from './types';

@Resolver()
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => GetExchangeRatesResult)
    async exchangeRates(@Args('language') language: string): Promise<GetExchangeRatesResult> {
        if (!isLanguage(language)) {
            throw new Error(`Unsupported language: ${language}`);
        }
        return this.exchangeRateService.getExchangeRates(language);
    }
}
