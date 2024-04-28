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

    @Query(() => [ExchangeRate])
    async getExchangeRates() {
        const response = await this.exchangeRateService.getExchangeRates();
        return response;
    }
}
