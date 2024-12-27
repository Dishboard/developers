import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExchangeRate } from '../../entities/exchange-rate.entity';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
    let service: ExchangeRateService;
    let exchangeRateRepository: Repository<ExchangeRate>;

    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key === 'EXCHANGE_RATE_API_URL') {
                return 'https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt';
            }
            return null;
        }),
    };

    const mockExchangeRateRepository = {
        find: jest.fn(),
        clear: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExchangeRateService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: getRepositoryToken(ExchangeRate), useValue: mockExchangeRateRepository },
            ],
        }).compile();

        service = module.get<ExchangeRateService>(ExchangeRateService);
        exchangeRateRepository = module.get<Repository<ExchangeRate>>(
            getRepositoryToken(ExchangeRate)
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should fetch exchange rates from the API', async () => {
        jest.spyOn(service as any, 'fetchExchangeRatesFromBank').mockResolvedValue([
            { country: 'USA', currency: 'dollar', amount: 1, code: 'USD', rate: 24.218 },
        ]);

        jest.spyOn(exchangeRateRepository, 'find').mockResolvedValue([]);
        jest.spyOn(exchangeRateRepository, 'clear').mockResolvedValue(undefined);
        jest.spyOn(exchangeRateRepository, 'save').mockResolvedValue([] as any);

        const result = await service.getExchangeRates();

        expect(result).toEqual({
            rates: [{ country: 'USA', currency: 'dollar', amount: 1, code: 'USD', rate: 24.218 }],
            lastFetched: expect.any(Date),
        });
    });
});
