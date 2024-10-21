import { Module } from '@nestjs/common';
import { ExchangeRateResolver } from './exchange-rate.resolver';
import { ExchangeRateEntityModule } from 'src/entity-modules/exchange-rate/exchange-rate.module';
import { ExchangeRateScheduler } from './exchange-rate.scheduler';

@Module({
    imports: [ExchangeRateEntityModule],
    providers: [ExchangeRateResolver, ExchangeRateScheduler],
    exports: [],
})
export class ExchangeRateModule {}
