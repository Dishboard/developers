import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { EntityWithMeta } from '../common';

@ObjectType()
@Entity({ name: 'exchange_rates' })
export class ExchangeRate extends EntityWithMeta {
    @Column()
    @Field()
    validFor!: string;

    @Column()
    @Field(() => Int)
    order!: number;

    @Column()
    @Field()
    country!: string;

    @Column()
    @Field()
    currency!: string;

    @Column()
    @Field(() => Float)
    amount!: number;

    @Column()
    @Field()
    currencyCode!: string;

    @Column('decimal')
    @Field(() => Float)
    rate!: number;
}
