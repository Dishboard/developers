import { Args, Query, Resolver } from '@nestjs/graphql';
import { ExchangeRateService } from './exchange-rate.service';
import { GetExchangeRatesResult } from './types';

@Resolver()
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => GetExchangeRatesResult)
    async exchangeRates(@Args('language') language: string): Promise<GetExchangeRatesResult> {
        return this.exchangeRateService.getExchangeRates(language);
    }
}
