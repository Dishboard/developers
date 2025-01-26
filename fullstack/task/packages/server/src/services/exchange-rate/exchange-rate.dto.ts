import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExchangeRateDto {
    @Field()
    public country!: string;

    @Field()
    public currency!: string;

    @Field()
    public amount!: number;

    @Field()
    public code!: string;

    @Field()
    public rate!: number;

    @Field()
    public lastUpdated!: Date;
}
