import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export interface ExchangeRateResponse {
    validFor: string;
    order: number;
    country: string;
    currency: string;
    amount: number;
    currencyCode: string;
    rate: number;
}

export interface ExchangeRateResponseBody { rates: ExchangeRateResponse[] }

export interface CNBApiError {
    description: string;
    endPoint: string;
    errorCode: 'INTERNAL_SERVER_ERROR' | 'VALIDATION_ERROR' | string;
    happenedAt: string;
    messageId: string;
}


@Injectable()
export class CNBService implements ICNBService {
    private readonly logger: Logger = new Logger(CNBService.name);

    constructor(
        private httpService: HttpService
    ) {
    }

    public async getExchangeRatesFromCNB(
        date: Date = new Date(),
        lang: string = 'EN',
    ): Promise<ExchangeRateResponseBody> {
        const stringDate = date.toISOString().split('T')[0];

        const url = `https://api.cnb.cz/cnbapi/exrates/daily?date=${stringDate}&lang=${lang.toUpperCase()}`;

        try {
            const response = await firstValueFrom(this.httpService.get(url));
            return response.data as ExchangeRateResponseBody;
        } catch (error) {
            if (error.response?.data) {
                const structuredError = error.response.data;
                this.logger.error('Structured Error:', structuredError);

                throw new BadRequestException(
                    `CNB API Error: ${structuredError.description} (Code: ${structuredError.errorCode})`,
                );
            }

            this.logger.error('Unexpected Error:', error.message);
            throw new InternalServerErrorException('Failed to fetch exchange rates.');
        }
    }
}

export interface ICNBService {
    getExchangeRatesFromCNB(date: Date, lang: string): Promise<ExchangeRateResponseBody>;
}
