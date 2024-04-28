import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { ExchangeRateService } from './exchange-rate.service';

@Resolver()
export class ExchangeRateResolver {
    constructor(
        @Inject(ExchangeRateService)
        private readonly exchangeRateService: ExchangeRateService
    ) {}

    // TODO: Implement a GraphQL Query that returns the exchange rates
    @Query(() => [ExchangeRate])
    async getExchangeRates() {
        const response = await this.exchangeRateService.getExchangeRates();
        return response;
    }
}
