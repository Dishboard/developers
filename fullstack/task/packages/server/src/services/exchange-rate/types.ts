import { Field, ObjectType } from '@nestjs/graphql';
import { z } from 'zod';
import { ExchangeRate } from '../../entities';

@ObjectType()
export class GetExchangeRatesResult {
    @Field(() => [ExchangeRate])
    rates!: ExchangeRate[];

    @Field(() => Date)
    timestamp!: Date;

    @Field(() => Boolean)
    cached!: boolean;
}

export const ExpectedExchangeRateCNBSchema = z.object({
    currencyCode: z.string(),
    currency: z.string(),
    order: z.number().int(),
    rate: z.number(),
    amount: z.number().int(),
    country: z.string(),
    validFor: z.string(),
});

export type ExchangeRateCNB = z.infer<typeof ExpectedExchangeRateCNBSchema>;

export const expectedExchangeRateResponseSchema = z.object({
    rates: z.array(ExpectedExchangeRateCNBSchema),
});
