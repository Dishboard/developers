import { Field, ObjectType } from '@nestjs/graphql';
import { ExchangeRate } from '../entities';

@ObjectType()
export class ExchangeRateResponse {
    @Field(() => [ExchangeRate])
    data!: ExchangeRate[];

    @Field(() => String)
    timestamp!: string;
}
