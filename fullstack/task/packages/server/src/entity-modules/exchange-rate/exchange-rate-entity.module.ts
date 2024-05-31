import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from '../../entities';
import { ExchangeRateModule } from '../../services/exchange-rate/exchange-rate.module';
import { ExchangeRateEntityService } from './exchange-rate-entity.service';
import { ExchangeRateEntityResolver } from './exchange-rate-entity.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([ExchangeRate]), ExchangeRateModule],
    providers: [ExchangeRateEntityService, ExchangeRateEntityResolver],
    exports: [],
})
export class ExchangeRateEntityModule {}
