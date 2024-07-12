import { Args, Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from './cache.interceptor';
import { CreateDateColumn } from 'typeorm';

@ObjectType()
class ExchangeRatesResponse {
    @Field(() => [ExchangeRate])
    value: ExchangeRate[];

    @Field()
    createdAt: Date;
}
@Resolver()
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => ExchangeRatesResponse)
    @UseInterceptors(CacheInterceptor)
    async exchangeRates(@Args('lang') lang: string): Promise<ExchangeRatesResponse> {
        return this.exchangeRateService.getExchangeRates(lang);
    }
}
