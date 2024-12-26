import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn,BaseEntity } from 'typeorm';
import { IsString } from 'class-validator';
import { VAR_CHAR } from 'src/common';

@Entity()
@ObjectType()
export class ExchangeRate extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @IsString()
    @Field()
    @Column({ ...VAR_CHAR })
    country!: string;

    @IsString()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    currency!: string;

    @Field()
    @Column()
    amount!: number;

    @Field(() => String)
    @Column({ ...VAR_CHAR })
    @IsString()
    code!: string;

    @Field()
    @Column()
    rate!: number;

    @Field()
    @Column()
    timestamp!: Date;
}