import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
    let service: ExchangeRateService;
    let exchangeRateRepository: jest.Mocked<Repository<ExchangeRate>>;
    let mockAxios: MockAdapter;

    const mockExchangeRate = {
        country: 'Czech Republic',
        currency: 'Czech Koruna',
        amount: '1',
        currencyCode: 'CZK',
        rate: '24.50',
        updatedAtUtc: new Date(),
    } as ExchangeRate;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExchangeRateService,
                {
                    provide: getRepositoryToken(ExchangeRate),
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ExchangeRateService>(ExchangeRateService);
        exchangeRateRepository = module.get<Repository<ExchangeRate>>(
            getRepositoryToken(ExchangeRate)
        ) as jest.Mocked<Repository<ExchangeRate>>;
        mockAxios = new MockAdapter(axios);

        jest.clearAllMocks();
    });

    afterEach(() => {
        mockAxios.reset();
    });

    it('It runs', () => {
        expect(service).toBeDefined();
    });

    describe('fetchAndStoreExchangeRates', () => {
        it('should fetch and store exchange rates from API', async () => {
            const mockApiResponse = {
                rates: [
                    {
                        country: 'Czech Republic',
                        currency: 'Czech Koruna',
                        amount: '1',
                        currencyCode: 'CZK',
                        rate: '24.50',
                    },
                ],
            };

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mockAxios.onGet(process.env.CURRENCY_API_ENDPOINT!).reply(200, mockApiResponse);

            exchangeRateRepository.findOne.mockResolvedValueOnce(null); // No existing rate
            exchangeRateRepository.create.mockReturnValueOnce(mockExchangeRate);
            exchangeRateRepository.save.mockResolvedValueOnce(mockExchangeRate);

            await service.fetchAndStoreExchangeRates();

            expect(exchangeRateRepository.findOne).toHaveBeenCalledWith({
                where: { currencyCode: 'CZK' },
            });
            expect(exchangeRateRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    country: 'Czech Republic',
                    currency: 'Czech Koruna',
                    amount: '1',
                    currencyCode: 'CZK',
                    rate: '24.50',
                })
            );
            expect(exchangeRateRepository.save).toHaveBeenCalledWith(mockExchangeRate);
        });

        it('should update existing exchange rate', async () => {
            const mockApiResponse = {
                rates: [
                    {
                        country: 'Czech Republic',
                        currency: 'Czech Koruna',
                        amount: '1',
                        currencyCode: 'CZK',
                        rate: '24.50',
                    },
                ],
            };

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mockAxios.onGet(process.env.CURRENCY_API_ENDPOINT!).reply(200, mockApiResponse);

            // Mock the database repository to simulate an existing rate
            exchangeRateRepository.findOne.mockResolvedValueOnce(mockExchangeRate);

            const mockUpdateResult: UpdateResult = {
                generatedMaps: [],
                raw: [],
                affected: 1, // Assuming 1 row was affected in the update
            };

            // Mock the update method with a valid UpdateResult
            exchangeRateRepository.update.mockResolvedValueOnce(mockUpdateResult);

            await service.fetchAndStoreExchangeRates();

            expect(exchangeRateRepository.findOne).toHaveBeenCalledWith({
                where: { currencyCode: 'CZK' },
            });
            expect(exchangeRateRepository.update).toHaveBeenCalledWith(
                { currencyCode: 'CZK' },
                expect.objectContaining({
                    rate: '24.50',
                })
            );
        });

        it('should throw an error if fetching from API fails', async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mockAxios.onGet(process.env.CURRENCY_API_ENDPOINT!).reply(500);

            await expect(service.fetchAndStoreExchangeRates()).rejects.toThrow(
                'Failed to fetch or store exchange rates.'
            );
        });
    });

    describe('getExchangeRates', () => {
        it('should return exchange rates from the database', async () => {
            exchangeRateRepository.find.mockResolvedValue([mockExchangeRate]);

            const result = await service.getExchangeRates();

            expect(exchangeRateRepository.find).toHaveBeenCalled();

            expect(result).toEqual([mockExchangeRate]);
        });

        it('should refetch and store new data if the latest data is outdated', async () => {
            const outdatedRate = {
                ...mockExchangeRate,
                updatedAtUtc: new Date(Date.now() - 6 * 60 * 1000),
            }; // Older than 5 minutes

            exchangeRateRepository.find.mockResolvedValueOnce([outdatedRate]);
            const fetchSpy = jest
                .spyOn(service, 'fetchAndStoreExchangeRates')
                .mockResolvedValueOnce(undefined);

            await service.getExchangeRates();

            expect(fetchSpy).toHaveBeenCalled();
        });

        it('should fetch new data if no records exist', async () => {
            // Mock no data in the database
            exchangeRateRepository.find.mockResolvedValueOnce([]);
            const fetchSpy = jest
                .spyOn(service, 'fetchAndStoreExchangeRates')
                .mockResolvedValueOnce(undefined);

            await service.getExchangeRates();

            expect(fetchSpy).toHaveBeenCalled();
        });
    });
});
