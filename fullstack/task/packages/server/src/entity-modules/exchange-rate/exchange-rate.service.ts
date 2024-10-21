import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../../entities';
import { CreateExchangeRateInputType } from './dto';
import { ExchangeRateRepository } from './exchange-rate.repository';

@Injectable()
export class ExchangeRateService {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: ExchangeRateRepository
    ) {}

    public async insertAll(exchangeRates: Partial<ExchangeRate>[]): Promise<ExchangeRate[]> {
        await this.exchangeRateRepository.clear();
        const exchangeRatesEntities = this.exchangeRateRepository.create(exchangeRates);
        await this.exchangeRateRepository.insert(exchangeRatesEntities);
        return exchangeRatesEntities;
    }

    public async findAll(): Promise<ExchangeRate[]> {
        return this.exchangeRateRepository.find({})
    }
}
