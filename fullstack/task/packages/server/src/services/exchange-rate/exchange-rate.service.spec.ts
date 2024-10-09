import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateService } from './exchange-rate.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  let exchangeRateRepository: Repository<ExchangeRate>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRateService,
        {
          provide: getRepositoryToken(ExchangeRate),
          useClass: Repository, // Use mock repository for testing
        },
      ],
    }).compile();

    service = module.get<ExchangeRateService>(ExchangeRateService);
    exchangeRateRepository = module.get<Repository<ExchangeRate>>(getRepositoryToken(ExchangeRate));
  });

  it('It runs', () => {
    expect(service).toBeDefined();
  });
});
