import { Query, Resolver } from '@nestjs/graphql';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateDto } from './exchange-rate.dto';

@Resolver(() => ExchangeRateDto)
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => [ExchangeRateDto])
    async exchangeRates(): Promise<ExchangeRateDto[]> {
        return this.exchangeRateService.getExchangeRates();
    }
}
