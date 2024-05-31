import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions } from 'typeorm';
import { ExchangeRate } from '../../entities';
import { ExchangeRateService } from '../../services/exchange-rate/exchange-rate.service';
import { ExchangeRateEntityRepository } from './exchange-rate-entity.repository';
import { CreateExchangeRateInputType } from './dto';

@Injectable()
export class ExchangeRateEntityService {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: ExchangeRateEntityRepository,
        private readonly exchangeRateService: ExchangeRateService
    ) {}

    public getAll = async (): Promise<ExchangeRate[]> => {
        const validData = await this.exchangeRateRepository.find();

        const isValid = validData.some((rate: ExchangeRate) => {
            const fiveMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);
            return rate.updatedAtUtc > fiveMinutesAgo;
        });

        if (isValid) {
            return validData;
        }

        const fetchedRates = await this.exchangeRateService.getExchangeRates();

        if (validData.length === 0) {
            await this.batchedCreate(fetchedRates);
        }

        if (validData.length > 0) {
            await this.updateRates(fetchedRates);
        }
        return this.exchangeRateRepository.find();
    };

    public batchedCreate = async (data: CreateExchangeRateInputType[]) => {
        const exchangeRates = data.map((rate) => this.exchangeRateRepository.create(rate));
        await this.exchangeRateRepository.save(exchangeRates);

        return exchangeRates;
    };

    public updateRates = async (rates: CreateExchangeRateInputType[]) => {
        await Promise.all(
            rates.map(async (exchangeRate) => {
                const options: FindOneOptions<ExchangeRate> = {
                    where: { currency: exchangeRate.currency },
                };
                const existingRate = await this.exchangeRateRepository.findOne(options);

                if (existingRate) {
                    existingRate.rate = exchangeRate.rate;
                    existingRate.updatedAtUtc = new Date();
                    return this.exchangeRateRepository.save(existingRate);
                }
            })
        );
    };
}
