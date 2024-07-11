import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, delay, map, retryWhen, tap } from 'rxjs/operators';
import { concatMap, lastValueFrom, of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { ExchangeRate, Language } from '../../entities';
import {
    ExchangeRateCNB,
    GetExchangeRatesResult,
    expectedExchangeRateResponseSchema,
} from './types';
import { ExchangeRateRepository } from './exchange-rate.repository';

const DEFAULT_CNB_EXRATE_URL = 'https://api.cnb.cz/cnbapi/exrates/daily';

const isServerError = (error: AxiosError) => {
    return (error?.response?.status ?? 0) >= 500;
};

@Injectable()
export class ExchangeRateService {
    private readonly logger = new Logger(ExchangeRateService.name);
    private readonly cnbExRateUrl: string;
    readonly updateFrequencyMinutes: number;
    private readonly retryDelay: number;
    private readonly retryAttempts: number;

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(ExchangeRate)
        readonly exchangeRateRepository: ExchangeRateRepository,
        private configService: ConfigService
    ) {
        this.cnbExRateUrl =
            this.configService.get<string>('CNB_EXRATE_URL') ?? DEFAULT_CNB_EXRATE_URL;
        this.updateFrequencyMinutes =
            this.configService.get<number>('EXCHANGE_RATE_UPDATE_FREQUENCY_MINUTES') ?? 5;
        this.retryDelay = this.configService.get<number>('EXCHANGE_RATE_RETRY_DELAY') ?? 1000;
        this.retryAttempts = this.configService.get<number>('EXCHANGE_RATE_RETRY_ATTEMPTS') ?? 3;

        this.handleRequestErrorAndRetry = this.handleRequestErrorAndRetry.bind(this);
        this.transformResponseToRates = this.transformResponseToRates.bind(this);
    }

    // it shouldn't be here, but in Repository.
    // however, adding it as method is not trivial at all. probably, a skill issue
    async findByLanguage(language: Language): Promise<ExchangeRate[]> {
        return this.exchangeRateRepository
            .createQueryBuilder('exchangeRate')
            .where('exchangeRate.language = :language', { language })
            .getMany();
    }

    async getExchangeRates(language: Language): Promise<GetExchangeRatesResult> {
        const cachedRates = await this.findByLanguage(language);
        if (cachedRates.length) {
            this.logger.debug('Returning exchange rates from cache');
            return {
                rates: cachedRates,
                cached: true,
                timestamp: new Date(cachedRates[0].createdAtUtc),
            };
        }

        const rawRates = await this.fetchExchangeRatesFromApi(language);

        let rates: ExchangeRate[] = [];
        try {
            rates = await this.cacheExchangeRates(rawRates, language);
        } catch (e: unknown) {
            // we can also throw here. It depends on the requirements
            this.logger.error('Failed to cache exchange rates', e);
        }

        return {
            rates,
            cached: false,
            timestamp: new Date(),
        };
    }

    handleRequestErrorAndRetry(error: AxiosError, attempt: number) {
        const isAnyAttemptsToServerErrorRetry =
            isServerError(error) && attempt < this.retryAttempts;
        if (isAnyAttemptsToServerErrorRetry) {
            this.logger.warn(
                `Retrying (${attempt + 1}/${this.retryAttempts})... Error: ${error.message}`
            );
            return of(error).pipe(delay(this.retryDelay));
        }
        this.logger.error(
            `Retry condition not met. Request status ${error.code}. Failing...`,
            error
        );
        throw new Error(error.message);
    }

    transformResponseToRates(response: Partial<AxiosResponse>) {
        const parseResult = expectedExchangeRateResponseSchema.safeParse(response.data);
        if (parseResult.success) {
            return parseResult.data.rates.map((rate) => this.mapToExchangeRate(rate));
        }
        this.logger.warn(`Unexpected API response format: ${parseResult.error.message}}`);
        return [];
    }

    fetchExchangeRatesFromApi(language: Language): Promise<ExchangeRate[]> {
        const apiUrl = `${this.cnbExRateUrl}?lang=${language}`;
        this.logger.log(`Fetching exchange rates from API: ${apiUrl}`);
        const source$ = this.httpService.get(apiUrl).pipe(
            tap(() => this.logger.log(`Fetched data from API`)),
            retryWhen((errors) => errors.pipe(concatMap(this.handleRequestErrorAndRetry))),
            map(this.transformResponseToRates),
            catchError((error) => {
                this.logger.error(`Failed to fetch exchange rates from API: ${error}`);
                return of([]);
            })
        );
        return lastValueFrom(source$);
    }

    mapToExchangeRate(rateLike: ExchangeRateCNB) {
        const rate = new ExchangeRate();
        Object.assign(rate, rateLike, {
            validFor: new Date(rateLike.validFor),
            createdAtUtc: new Date(),
        });
        rate.updatedAtUtc = rate.createdAtUtc;
        return rate;
    }

    async cacheExchangeRates(rates: ExchangeRate[], language: Language): Promise<ExchangeRate[]> {
        const ratesToSave = rates.map((rate) => {
            const newRate = new ExchangeRate();
            Object.assign(newRate, rate, { language });
            return newRate;
        });
        return this.exchangeRateRepository.save(ratesToSave);
    }
}
