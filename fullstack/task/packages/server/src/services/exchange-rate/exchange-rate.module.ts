import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateResolver } from './exchange-rate.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from '../caching/caching.service';
import { Cache } from 'src/entities/cache.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ExchangeRate, Cache]), HttpModule],
    providers: [ExchangeRateService, ExchangeRateResolver, CacheService],
    exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
