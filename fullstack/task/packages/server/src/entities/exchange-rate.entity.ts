import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
@ObjectType()
export class ExchangeRate extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @IsString()
    @Field()
    @Column()
    country!: string;

    @IsString()
    @Field(() => String)
    @Column()
    currency!: string;

    @Field()
    @Column()
    amount!: number;

    @Field(() => String)
    @Column()
    @IsString()
    code!: string;

    @Field()
    @Column()
    rate!: string;

    @Field()
    @Column()
    timestamp!: Date;
}
