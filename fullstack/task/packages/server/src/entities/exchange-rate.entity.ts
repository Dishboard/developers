import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { EntityWithMeta } from '../common';
import { VAR_CHAR } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @IsString()
    @MinLength(3)
    @Column({ ...VAR_CHAR })
    @Field(() => String)
    public country!: string;

    @IsString()
    @MinLength(2)
    @Column({ ...VAR_CHAR })
    @Field(() => String)
    public currency!: string;

    @IsNumber()
    @Column({ type: 'integer', default: 1 })
    @Field(() => Number)
    public amount!: number;

    @IsString()
    @MinLength(2)
    @Column({ ...VAR_CHAR })
    @Field(() => String)
    public code!: string;

    @IsNumber()
    @Column({ type: 'decimal' })
    @Field(() => Number)
    public rate!: number;
}
