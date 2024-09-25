import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateResolver } from './exchange-rate.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from '../../entities';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExchangeRate]),
        HttpModule.register({
            baseURL: process.env.EXCHANGE_RATES_API_URL_BASE,
        }),
    ],
    providers: [ExchangeRateService, ExchangeRateResolver],
    exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
