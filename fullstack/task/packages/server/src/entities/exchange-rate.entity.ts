import { Field, ObjectType } from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class ExchangeRate extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    country!: string;

    @Field()
    @Column()
    currency!: string;

    @Field()
    @Column()
    amount!: number;

    @Field()
    @Column()
    code!: string;

    @Field()
    @Column({ type: 'float' })
    rate!: number;

    @Column(() => Date)
    @CreateDateColumn()
    createdAt = Date();

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt = Date();
}
