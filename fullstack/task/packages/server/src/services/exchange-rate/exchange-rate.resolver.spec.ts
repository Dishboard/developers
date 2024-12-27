import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateResolver } from './exchange-rate.resolver';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateResolver', () => {
    let resolver: ExchangeRateResolver;
    let service: ExchangeRateService;

    const mockExchangeRateService = {
        getExchangeRates: jest.fn().mockResolvedValue({
            rates: [{ country: 'USA', currency: 'dollar', amount: 1, code: 'USD', rate: 24.218 }],
            lastFetched: null,
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExchangeRateResolver,
                { provide: ExchangeRateService, useValue: mockExchangeRateService },
            ],
        }).compile();

        resolver = module.get<ExchangeRateResolver>(ExchangeRateResolver);
        service = module.get<ExchangeRateService>(ExchangeRateService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should return exchange rates', async () => {
        const result = await resolver.exchangeRates();
        expect(result).toEqual({
            rates: [{ country: 'USA', currency: 'dollar', amount: 1, code: 'USD', rate: 24.218 }],
            lastFetched: null,
        });
        expect(service.getExchangeRates).toHaveBeenCalledTimes(1);
    });
});
