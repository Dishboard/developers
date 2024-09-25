import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { ExchangeRate } from '../../entities';
import { IExchangeRate } from './types/exchange-rates.types';

@Injectable()
export class ExchangeRateService {
    private logger = new Logger(ExchangeRateService.name);
    private readonly EXCHANGE_API_URL_BASE = process.env.EXCHANGE_RATES_API_URL_BASE;

    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>
    ) {}

    public getExchangeRates = async (date?: Date): Promise<ExchangeRate[]> => {
        const endpointForDate = this.getEndpointUrlForDate(date || new Date());
        const cached: ExchangeRate[] = await this.getExchangeRatesFromCache();

        if (cached?.length) {
            return cached;
        }

        let rates: IExchangeRate[] = [];
        try {
            const apiResponse = await fetch(endpointForDate);
            const bodyParts: string[] = (await apiResponse.text()).split('\n');
            this.logger.log(`Parsing details for ${bodyParts.splice(0, 1)}`);

            const headings = this.transformDataLine(bodyParts.splice(0, 1)?.[0] || '');
            this.logger.log(`Details: ${headings.join(', ')}`);

            bodyParts.forEach((line) => {
                const transformedLine = this.transformDataLine(line);
                const [country, currency, amount, code, rate] = transformedLine;
                if (country && currency) {
                    rates.push({
                        country,
                        currency,
                        amount: Number(amount ?? 0),
                        code,
                        rate: Number(rate ?? 0),
                    });
                }
            });

            return await this.exchangeRateRepository.save(rates);
        } catch (err) {
            this.logger.error(`Failed to fetch endpoint: ${endpointForDate}`);
            throw new BadRequestException(`Could not save the Checz National Bank resources.`);
        }
    };

    private async getExchangeRatesFromCache(): Promise<ExchangeRate[]> {
        const last5Mins = new Date(new Date().getTime() - 5 * 60 * 1000);

        const cached = await this.exchangeRateRepository.find({
            where: {
                createdAtUtc: MoreThan(last5Mins),
            },
        });

        await this.exchangeRateRepository.delete({
            createdAtUtc: LessThan(last5Mins),
        });

        return cached;
    }

    private getEndpointUrlForDate(date: Date): string {
        return `${this.EXCHANGE_API_URL_BASE}?date=${format(date, 'dd.MM.yyyy')}`;
    }

    private transformDataLine(line: string): string[] {
        return line
            .trim()
            .split('|')
            .map((heading) => heading.trim());
    }
}
