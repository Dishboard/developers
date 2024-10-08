import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ExchangeRate } from '../../entities';
import { ExchangeRateFromAPI } from './exchange-rate.types';

@Injectable()
export class ExchangeRateService {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        private readonly httpService: HttpService
    ) {}

    /**
     * Get current daily exchange rates from database.
     *
     * @returns {Promise<ExchangeRate[]>} -array of current exchange rates.
     */
    public getExchangeRates = async (): Promise<ExchangeRate[]> => {
        const exchangeRates = await this.exchangeRateRepository.find();

        if (!exchangeRates) {
            throw new NotFoundException(`Exchange rates not found`);
        }

        return exchangeRates;
    };

    // https://api.cnb.cz/cnbapi/swagger-ui.html#/%2Fexrates/dailyUsingGET_1
    /**
     * Fetch daily exchange rates from the CNB (Czech National Bank) API.
     *
     * @param {string} [date] - An optional date string in the format 'yyyy-mm-dd'. Defaults to the current date if not provided.
     * @param {string} [lang] - An optional language code ('CZ' for Czech, 'EN' for English). Defaults to Czech ('CZ') if not provided.
     *
     * @returns {Promise<void>} - Loads the exchange rates into exchange_rates table.
     */
    public fetchExchangeRates = async (date?: string, lang?: 'CZ' | 'EN'): Promise<void> => {
        try {
            const apiUrl = 'https://api.cnb.cz/cnbapi/exrates/daily';

            const response = await lastValueFrom(
                this.httpService.get(apiUrl, {
                    params: {
                        ...(date ? { date } : {}),
                        ...(lang ? { lang } : {}),
                    },
                })
            );

            if (response.status === 200) {
                const { rates } = response.data;

                const exchangeRates: ExchangeRate[] = rates.map((rate: ExchangeRateFromAPI) => {
                    const exchangeRate = new ExchangeRate();
                    exchangeRate.validFor = rate.validFor;
                    exchangeRate.order = rate.order;
                    exchangeRate.country = rate.country;
                    exchangeRate.currency = rate.currency;
                    exchangeRate.amount = rate.amount;
                    exchangeRate.currencyCode = rate.currencyCode;
                    exchangeRate.rate = rate.rate;
                    return exchangeRate;
                });

                await this.exchangeRateRepository.save(exchangeRates);
            } else {
                console.error(`Error fetching rates: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching daily exchange rates:', error);
        }
    };

    /**
     * Truncate exchange_rates table.
     *
     * @returns {Promise<void>} - Empty the exchange_rates table
     */
    public async truncateExchangeRates(): Promise<void> {
        await this.entityManager.query('TRUNCATE TABLE exchange_rates RESTART IDENTITY CASCADE;');
    }

    /**
     * Remove old and fetch current daily exchange rates from the CNB (Czech National Bank) API.
     *
     * @returns {Promise<void>} - Empty the exchange_rates table, load current echange rates into DB
     */

    @Cron(CronExpression.EVERY_10_SECONDS)
    public async loadCurrentExchangeRates(): Promise<void> {
        await this.truncateExchangeRates();
        await this.fetchExchangeRates();
    }
}
