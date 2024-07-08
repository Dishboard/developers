import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { EntityWithMeta } from '../common';
import { VAR_CHAR } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currency!: string;

    @Field(() => Number)
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    public rate!: number;

    @Field(() => Number)
    @Column({ type: 'integer' })
    public amount!: number;

    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public country!: string;

    @Field(() => Date)
    @Column({ type: 'timestamptz' })
    public validFor!: Date;

    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currencyCode!: string;
}
