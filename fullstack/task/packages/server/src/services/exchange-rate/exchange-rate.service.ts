import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, delay, map, retryWhen, tap } from 'rxjs/operators';
import { concatMap, lastValueFrom, of, throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { ExchangeRate } from '../../entities';
import {
    ExchangeRateCNB,
    GetExchangeRatesResult,
    expectedExchangeRateResponseSchema,
} from './types';

const DEFAULT_CNB_EXRATE_URL = 'https://api.cnb.cz/cnbapi/exrates/daily';

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
        private readonly exchangeRateRepository: Repository<ExchangeRate>,
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

    async getExchangeRates(language: string): Promise<GetExchangeRatesResult> {
        const cachedRates = await this.getCachedExchangeRates();
        if (cachedRates.length) {
            this.logger.debug('Returning exchange rates from cache');
            return {
                rates: cachedRates,
                cached: true,
                timestamp: cachedRates[0].createdAtUtc,
            };
        }

        const rates = await this.fetchExchangeRatesFromApi(language);

        // unlikely
        try {
            await this.cacheExchangeRates(rates);
        } catch (e: unknown) {
            this.logger.error('Failed to cache exchange rates', e);
        }

        this.logger.debug('Returning exchange rates from API');
        return {
            rates,
            cached: false,
            timestamp: new Date(),
        };
    }

    getCachedExchangeRates(): Promise<ExchangeRate[]> {
        const fiveMinutesAgo = new Date(Date.now() - this.updateFrequencyMinutes * 60 * 1000);
        return this.exchangeRateRepository.find({
            where: {
                createdAtUtc: MoreThan(fiveMinutesAgo),
            },
        });
    }

    handleRequestErrorAndRetry(error: AxiosError, attempt: number) {
        const isAnyAttemptsToServerErrorRetry =
            this.isServerError(error) && attempt < this.retryAttempts;
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

    fetchExchangeRatesFromApi(language: string): Promise<ExchangeRate[]> {
        const apiUrl = `${this.cnbExRateUrl}?lang=${language}`;
        const source$ = this.httpService.get(apiUrl).pipe(
            tap(() => this.logger.log('Fetched data from API: ')),
            retryWhen((errors) => errors.pipe(concatMap(this.handleRequestErrorAndRetry))),
            map(this.transformResponseToRates),
            catchError((error) => {
                this.logger.error('Failed to fetch exchange rates from API', error);
                return of([]);
            })
        );
        this.logger.debug(`Fetching exchange rates from API: ${apiUrl}`);
        return lastValueFrom(source$);
    }

    mapToExchangeRate(rateLike: ExchangeRateCNB) {
        const rate = new ExchangeRate();
        Object.assign(rate, rateLike, {
            validFor: new Date(rateLike.validFor),
        });
        this.logger.debug(`rate updated at: ${JSON.stringify(rate.updatedAtUtc)}`);
        return rate;
    }

    async cacheExchangeRates(rates: ExchangeRate[]) {
        await this.exchangeRateRepository.save(rates);
    }

    private isServerError(error: AxiosError): boolean {
        return (error?.response?.status ?? 0) >= 500;
    }
}
