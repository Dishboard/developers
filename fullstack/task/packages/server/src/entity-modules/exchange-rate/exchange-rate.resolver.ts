import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExchangeRate } from '../../entities';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateInputType } from './dto';

@Resolver(() => ExchangeRate)
export class ExchangeRateResolver {
    constructor(private readonly propertyService: ExchangeRateService) {}

    @Query(() => ExchangeRate, { nullable: true })
    public async exchangeRateByName(@Args('name') name: string) {
        return this.propertyService.getByName(name);
    }

    @Mutation(() => ExchangeRate)
    public async createExchangeRate(@Args('data') data: CreateExchangeRateInputType): Promise<ExchangeRate> {
        return this.propertyService.createExchangeRate(data);
    }
}
