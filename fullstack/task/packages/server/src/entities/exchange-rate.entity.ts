import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { EntityWithMeta } from 'src/common';
import { Entity, Column } from 'typeorm';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @Column()
    @IsString()
    @Field(() => String)
    country: string;

    @Column()
    @IsString()
    @Field(() => String)
    currency: string;

    @Column()
    @Field(() => Number)
    @IsNumber()
    amount: number;

    @Column()
    @IsString()
    @Field(() => String)
    currencyCode: string;

    @Column()
    @Field(() => Number)
    @IsNumber()
    rate: number;
}
