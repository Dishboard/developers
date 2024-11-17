import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateResolver } from './exchange-rate.resolver';
import { ExchangeRate } from './entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExchangeRate]),
        BullModule.registerQueueAsync({
            name: 'exchangeRate',
        }),
    ],
    providers: [ExchangeRateService, ExchangeRateResolver],
    exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
