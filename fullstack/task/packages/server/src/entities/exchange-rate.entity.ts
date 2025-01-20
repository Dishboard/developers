import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { EntityWithMeta } from '../common';
import { VAR_CHAR } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @Field(() => Date)
    @Column()
    validFor!: Date;

    @Field(() => String)
    @Column()
    country!: string;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currency!: string;

    @Field(() => Number)
    @Column('decimal')
    public amount!: number;

    @Field(() => String)
    @Column()
    public currencyCode!: string;

    @Field(() => Number)
    @Column('decimal')
    public rate!: number;

    /* Relations */
}
