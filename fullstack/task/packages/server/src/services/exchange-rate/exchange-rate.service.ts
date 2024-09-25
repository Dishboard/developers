import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { ExchangeRate } from '../../entities';
import { IExchangeRate } from './types/exchange-rates.types';

@Injectable()
export class ExchangeRateService {
    private logger = new Logger(ExchangeRateService.name);

    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>,
        private readonly httpService: HttpService
    ) {}

    public getExchangeRates = async (): Promise<ExchangeRate[]> => {
        const cached: ExchangeRate[] = await this.getExchangeRatesFromDb();

        if (cached?.length) {
            return cached;
        }

        let rates: IExchangeRate[] = [];
        try {
            const apiResponse = await this.httpService.get('daily.txt').toPromise();

            const bodyParts: string[] = apiResponse?.data.split('\n');
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
            this.logger.error(`Failed to fetch Checz National Bank resources`);
            throw new BadRequestException(`Could not save the Checz National Bank resources.`);
        }
    };

    private async getExchangeRatesFromDb(): Promise<ExchangeRate[]> {
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

    private transformDataLine(line: string): string[] {
        return line
            .trim()
            .split('|')
            .map((heading) => heading.trim());
    }
}
