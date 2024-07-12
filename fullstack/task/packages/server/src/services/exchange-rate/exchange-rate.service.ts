import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { CreateDateColumn } from 'typeorm';

@ObjectType()
class ExchangeRatesResponse {
    @Field(() => [ExchangeRate])
    value: ExchangeRate[];

    @CreateDateColumn()
    createdAt: Date;
}
@Injectable()
export class ExchangeRateService {
    constructor(private readonly httpService: HttpService) {}

    public getExchangeRates = async (lang: string): Promise<ExchangeRatesResponse> => {
        try {
            const response = await this.httpService.axiosRef.get(
                `https://api.cnb.cz/cnbapi/exrates/daily?lang=${lang}`
            );
            const { rates } = response.data;
            const currentDate = new Date();
            return { value: rates, createdAt: currentDate };
        } catch (error) {
            throw error;
        }
    };
}
