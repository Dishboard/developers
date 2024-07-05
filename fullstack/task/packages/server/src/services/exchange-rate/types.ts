import { Field, ObjectType } from '@nestjs/graphql';
import { ExchangeRate } from '../../entities/exchange-rate.entity';

@ObjectType()
export class GetExchangeRatesResult {
    @Field(() => [ExchangeRate])
    rates!: ExchangeRate[];

    @Field(() => Date)
    timestamp!: Date;

    @Field(() => Boolean)
    cached!: boolean;
}
