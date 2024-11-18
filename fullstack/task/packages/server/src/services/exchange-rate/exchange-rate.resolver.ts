import { Query, Resolver } from '@nestjs/graphql';
import { ExchangeRateResponse } from './dto/exchange-rate-response.dto';
import { ExchangeRateService } from './exchange-rate.service';

@Resolver()
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => ExchangeRateResponse)
    async exchangeRates(): Promise<ExchangeRateResponse> {
        return this.exchangeRateService.getExchangeRates();
    }
}
