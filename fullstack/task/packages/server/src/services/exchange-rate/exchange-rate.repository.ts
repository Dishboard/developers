import { Repository } from 'typeorm';
import { ExchangeRate } from 'src/entities/exchange-rates.entity';

export class ExchangeRateRepository extends Repository<ExchangeRate> {}
