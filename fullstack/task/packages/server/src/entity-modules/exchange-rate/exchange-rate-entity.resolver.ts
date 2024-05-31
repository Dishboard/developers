import { Query, Resolver } from '@nestjs/graphql';
import { ExchangeRate } from '../../entities';
import { ExchangeRateEntityService } from './exchange-rate-entity.service';

@Resolver(() => ExchangeRate)
export class ExchangeRateEntityResolver {
    constructor(private readonly exchangeRateEntityService: ExchangeRateEntityService) {}

    @Query(() => [ExchangeRate], { nullable: true })
    public async getExchangeRates() {
        return this.exchangeRateEntityService.getAll();
    }
}
