import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsString, MinLength } from 'class-validator';
import { EntityWithMeta } from '../../../common';
import { VAR_CHAR } from '../../../entities/constants';

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

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public amount!: string;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public code!: string;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public rate!: string;
    /* Relations */
}
