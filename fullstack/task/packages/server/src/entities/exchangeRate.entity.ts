import {Column, Entity} from "typeorm";
import {Field, ObjectType} from "@nestjs/graphql";
import {EntityWithMeta} from "../common";
import {IsDate, IsNumber, IsString, MinLength} from "class-validator";
import {VAR_CHAR} from "./constants";

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @IsDate()
    @Field(() => Date)
    @Column({ type: 'date' })
    public validFor!: Date;

    @IsNumber()
    @Field(() => Number)
    @Column({ type: 'int' })
    public order!: number;

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

    @IsNumber()
    @Field(() => Number)
    @Column({ type: 'float' })
    public amount!: number;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currencyCode!: string;

    @IsNumber()
    @Field(() => Number)
    @Column({ type: 'float' })
    public rate!: number;
}
