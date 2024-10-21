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

    public getByName = async (name: string) => {
        const exchangeRate = await this.exchangeRateRepository.findOne({ where: { name } });
        if (!exchangeRate) {
            throw new NotFoundException(`ExchangeRate ${name} not found`);
        }

        return exchangeRate;
    };

    public createExchangeRate = async (data: CreateExchangeRateInputType) => {
        const exchangeRate = this.exchangeRateRepository.create({
            ...data,
        });

        return this.exchangeRateRepository.save(exchangeRate);
    };
}
