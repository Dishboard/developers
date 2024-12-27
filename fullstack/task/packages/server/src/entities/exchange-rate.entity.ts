import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('exchange_rates')
@ObjectType() // Marks the class as a GraphQL ObjectType
export class ExchangeRate {
    @PrimaryGeneratedColumn()
    @Field(() => Number) // Exposes this field in the GraphQL schema
    id!: number;

    @Column()
    @Field(() => String)
    country!: string;

    @Column()
    @Field(() => String)
    currency!: string;

    @Column('float')
    @Field(() => Float)
    amount!: number;

    @Column()
    @Field(() => String)
    code!: string;

    @Column('float')
    @Field(() => Float)
    rate!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Field(() => Date)
    createdAt!: Date;
}
