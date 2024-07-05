import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ExchangeRate } from '../../entities/exchange-rate.entity';
import { GetExchangeRatesResult } from './types';

@Injectable()
export class ExchangeRateService {
    private readonly logger = new Logger(ExchangeRateService.name);

    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>,
        private configService: ConfigService
    ) {}

    public async getExchangeRates(language: string): Promise<GetExchangeRatesResult> {
        return {
            rates: [],
            cached: false,
            timestamp: new Date(),
        };
    }

    private async getCachedExchangeRates(): Promise<ExchangeRate[]> {
        return [];
    }

    private async fetchExchangeRatesFromApi(language: string): Promise<ExchangeRate[]> {
        const cnbExrateUrl = this.configService.get<string>('CNB_EXRATE_URL');
        this.logger.log(
            `Fetching exchange rates from API for language: ${language} at ${cnbExrateUrl}`
        );
        return [];
    }
    private async cacheExchangeRates(exchangeRates: ExchangeRate[]): Promise<void> {
        await this.exchangeRateRepository.save(exchangeRates);
    }
}
