import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateResolver } from './exchange-rate.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([ExchangeRate])],
    providers: [ExchangeRateService, ExchangeRateResolver],
    exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
