import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { EntityWithMeta } from '../common';
import { IExchangeRate } from '../services/exchange-rate/types';
import { VAR_CHAR } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta implements IExchangeRate {
    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    country!: string;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    currency!: string;

    @IsString()
    @MinLength(2)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    code!: string;

    @IsNumber()
    @Field(() => Number)
    @Column('float')
    amount!: number;

    @IsNumber()
    @Field(() => Number)
    @Column('float')
    rate!: number;

    constructor(e: Partial<ExchangeRate>) {
        super();
        Object.assign(this, e);
    }
}
