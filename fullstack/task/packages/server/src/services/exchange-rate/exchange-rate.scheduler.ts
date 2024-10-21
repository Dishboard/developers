import { Injectable, Logger } from '@nestjs/common';
import { Interval, Timeout } from '@nestjs/schedule';
import { ExchangeRate } from 'src/entities';
import { ExchangeRateService } from 'src/entity-modules/exchange-rate/exchange-rate.service';

const EXCHANGE_RATE_REQUEST_TIMEOUT = 5 * 60 * 1000;
const EXCHANGE_RATE_REQUEST_URL = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';

@Injectable()
export class ExchangeRateScheduler {
    private readonly logger = new Logger(ExchangeRateScheduler.name, { timestamp: true });

    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Interval(EXCHANGE_RATE_REQUEST_TIMEOUT)
    async insertExchangeRatesEvery5Mins(): Promise<void> {
        await this.getExchangeRates()
    }

    @Timeout(0)
    async insertExchangeRatesOnInitialization(): Promise<void> {
        await this.getExchangeRates()
    }

    private async getExchangeRates(): Promise<void> {
        try {
            const exchangeDateResponseText = await (await fetch(EXCHANGE_RATE_REQUEST_URL)).text();
            const exchangeRates: Partial<ExchangeRate>[] = parseExchangeRatesFromCNBResponse(exchangeDateResponseText);
            const exchangeRateEntities = await this.exchangeRateService.insertAll(exchangeRates);
            this.logger.log(`${exchangeRateEntities.length} exchange rate was imported`)
        } catch (e) {
            this.logger.error(e);
        }
    }
}

export function parseExchangeRatesFromCNBResponse(responseText: string): Partial<ExchangeRate>[] {
    const exchangeRates: Partial<ExchangeRate>[] = [];
    const exchangeDateResponseLines: string[] = responseText.split('\n');
    const exchangeDateLines: string[] = exchangeDateResponseLines.slice(2).filter(line => Boolean(line));
    for (const exchangeRateLine of exchangeDateLines) {
        const [country, currency, amountStr, code, rateStr] = exchangeRateLine.split('|');
        const amount = parseInt(amountStr, 10);
        const rate = parseFloat(rateStr);
        exchangeRates.push({ country, currency, amount, code, rate })
    }
    return exchangeRates;
}
 