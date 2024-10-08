import { Field, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { VAR_CHAR } from './constants';

@ObjectType()
@Entity('exchange_rates')
export class ExchangeRate {
    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    @Field(() => Number)
    public id!: number;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public validFor!: string;

    @IsInt()
    @IsPositive()
    @Field(() => Number)
    @Column({ type: 'int' })
    public order!: number;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public country!: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currency!: string;

    @IsInt()
    @IsPositive()
    @Field(() => Number)
    @Column({ type: 'int' })
    public amount!: number;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currencyCode!: string;

    @IsInt()
    @IsPositive()
    @Field(() => Number)
    @Column({ type: 'numeric', precision: 15, scale: 6 })
    public rate!: number;

    @Field(() => Number)
    @Column({ type: 'bigint', default: () => 'extract(epoch from now()) * 1000' })
    public createdAtUtc!: number;
}
