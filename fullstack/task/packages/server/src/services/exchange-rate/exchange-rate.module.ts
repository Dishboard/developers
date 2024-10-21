import { Module } from '@nestjs/common';
import { ExchangeRateResolver } from './exchange-rate.resolver';
import { ExchangeRateEntityModule } from 'src/entity-modules/exchange-rate/exchange-rate.module';

@Module({
    imports: [ExchangeRateEntityModule],
    providers: [ExchangeRateResolver],
    exports: [],
})
export class ExchangeRateModule {}
