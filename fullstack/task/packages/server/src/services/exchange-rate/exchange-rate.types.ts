import { Field, ObjectType } from '@nestjs/graphql';
import { ExchangeRate } from '../../entities/exchange-rate.entity';

@ObjectType()
export class ExchangeRateResponse {
    @Field(() => [ExchangeRate])
    rates!: ExchangeRate[];

    @Field(() => String, { nullable: true })
    lastFetched!: string | null;
}
