import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExchangeRate {
    @Field()
    country!: string;

    @Field()
    currency!: string;

    @Field()
    amount!: number;

    @Field()
    code!: string;

    @Field()
    rate!: number;
}