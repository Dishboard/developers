import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { EntityWithMeta } from '../common';
import { VAR_CHAR } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @IsString()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public country!: string;

    @IsString()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currency!: string;

    @IsNumber()
    @Field(() => Number)
    @Column('decimal')
    public amount!: number;

    @IsString()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public code!: string;

    @IsNumber()
    @Field(() => Number)
    @Column('decimal')
    public rate!: number;

    @IsDate()
    @Field(() => Date)
    @Column()
    public lastUpdated!: Date;
}
