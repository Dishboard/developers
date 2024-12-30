import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { EntityWithMeta } from '../common';
import { VAR_CHAR, DECIMAL, INT } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public country!: string;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currency!: string;

    @IsInt()
    @Field(() => Number)
    @Column({ ...INT })
    public amount!: number;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public code!: string;

    @Field(() => Float)
    @Column({ ...DECIMAL })
    public rate!: number;
}
