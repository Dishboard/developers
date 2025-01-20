import { DeepPartial, Repository } from 'typeorm';
import { ExchangeRate } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

// NOTE: Deprecated way to extend repository
// @EntityRepository(ExchangeRate)
// export class ExchangeRateRepository extends Repository<ExchangeRate> {
// }

@Injectable()
export class ExchangeRateRepository implements IExchangeRateRepository {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly repository: Repository<ExchangeRate>) { }

    public async getLatestRates(currencyCode?: string): Promise<ExchangeRate[]> {
        const queryBuilder = this.repository.createQueryBuilder('exchangeRate')
            .distinctOn(['exchangeRate.currencyCode'])
            .orderBy('exchangeRate.currencyCode')
            .addOrderBy('exchangeRate.createdAtUtc', 'DESC');

        if (currencyCode) {
            queryBuilder.where('exchangeRate.currencyCode = :currencyCode', { currencyCode });
        }

        return await queryBuilder.getMany();
    }

    public async save(exchangeRate: ExchangeRate[]): Promise<ExchangeRate[]> {
        return await this.repository.save(exchangeRate);
    }

    public async invalidateAll(): Promise<void> {
        await this.repository.createQueryBuilder()
            .softDelete()
            .from(ExchangeRate)
            .where('1=1')
            .execute();
    }

    public create(entityLike: DeepPartial<ExchangeRate>): ExchangeRate {
        return this.repository.create(entityLike);
    }
}

export abstract class IExchangeRateRepository {
    abstract getLatestRates(currencyCode?: string): Promise<ExchangeRate[]>;
    abstract save(exchangeRate: ExchangeRate[]): Promise<ExchangeRate[]>;
    abstract invalidateAll(): Promise<void>;
    abstract create(entityLike: DeepPartial<ExchangeRate>): ExchangeRate;
}