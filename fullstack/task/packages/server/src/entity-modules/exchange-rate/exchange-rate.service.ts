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

    public async createExchangeRate(data: CreateExchangeRateInputType) {
        const exchangeRate = this.exchangeRateRepository.create({
            ...data,
        });

        return this.exchangeRateRepository.save(exchangeRate);
    };

    public async updateOrCreateExchangeRate(data: CreateExchangeRateInputType) {
        const foundExchngeRate: ExchangeRate | null = await this.exchangeRateRepository.findOneBy({ country: data.country });

        if (foundExchngeRate) {
            return this.exchangeRateRepository.update({ id: foundExchngeRate.id }, { rate: data.rate })
        }
        
        const exchangeRate = this.exchangeRateRepository.create({
            ...data,
        });

        return this.exchangeRateRepository.save(exchangeRate);
    };

    public async findAll(): Promise<ExchangeRate[]> {
        return this.exchangeRateRepository.find({})
    }
}
