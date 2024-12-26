import { Query, Resolver } from '@nestjs/graphql';
import { ExchangeRateService } from './exchange-rate.service';

@Resolver()
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => String)
    async exchangeRates(): Promise<string> {
        return this.exchangeRateService.getExchangeRates();

    }
}
