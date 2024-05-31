import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsNumber, MinLength } from 'class-validator'; // Import IsNumber decorator
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { EntityWithMeta } from '../common';
import { VAR_CHAR } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR, unique: true })
    public code!: string;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currency!: string;

    @IsString()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public country!: string;

    @Field(() => String)
    @Column({ ...VAR_CHAR, length: '20', default: '0.0' })
    public rate!: string;

    @IsNumber()
    @Field(() => Number)
    @Column({ ...VAR_CHAR })
    public amount!: number;

    @BeforeInsert()
    createEventHandler() {
        this.createdAtUtc = new Date();
        this.updatedAtUtc = new Date();
    }
}
