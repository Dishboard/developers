import { Query, Resolver } from '@nestjs/graphql';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateResponse } from './exchange-rate.types';

@Resolver()
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => ExchangeRateResponse)
    async exchangeRates(): Promise<ExchangeRateResponse> {
        const { rates, lastFetched } = await this.exchangeRateService.getExchangeRates();
        return { rates, lastFetched: lastFetched ? lastFetched.toISOString() : null };
    }
}
