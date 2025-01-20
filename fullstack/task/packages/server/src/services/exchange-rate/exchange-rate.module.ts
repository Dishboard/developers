import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateResolver } from './exchange-rate.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from 'src/entities';
import { ExchangeRateRepository, IExchangeRateRepository } from './exchange-rate.repository';
import { CNBService } from './cnb.service';

@Module({
    imports: [TypeOrmModule.forFeature([ExchangeRate]), HttpModule],
    providers: [ExchangeRateService, ExchangeRateResolver, CNBService,
        {
            provide: IExchangeRateRepository,
            useClass: ExchangeRateRepository,
        },
    ],
    exports: [ExchangeRateService, IExchangeRateRepository],
})
export class ExchangeRateModule { }
