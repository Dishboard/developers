import { Query, Resolver } from '@nestjs/graphql';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate } from '../../entities';
@Resolver()
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => [ExchangeRate])
    async exchangeRates(): Promise<ExchangeRate[]> {
        return this.exchangeRateService.getExchangeRates();
    }
}
