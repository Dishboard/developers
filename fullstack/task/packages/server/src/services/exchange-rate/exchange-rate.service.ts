import axios from 'axios';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from 'src/entities';
@Injectable()
export class ExchangeRateService {
    private readonly CACHE_LIFETIME = 5 * 60 * 1000; // 5 minutes in milliseconds
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>,
    ) {}
    public getExchangeRates = async (): Promise<ExchangeRate[]>  => {
        const now = new Date();
        console.log('now: ', now);
        const cachedRates = await this.exchangeRateRepository.find({
            order: { timestamp: 'DESC' },
            take: 1,
        });

        console.log(cachedRates)
        if (cachedRates.length > 0 && now.getTime() - cachedRates[0].timestamp.getTime() < this.CACHE_LIFETIME) {
            return this.exchangeRateRepository.find();
        }
        // Found endpoints -
        // XML - https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml
        // TXT -https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt

        const url = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';
        
        try {
            const response = await axios.get(url);
            const data = response.data;
            
            const lines = data.split('\n');
            const exchangeRates = [];
            
            for (let i = 2; i < lines.length; i++) {
                const line = lines[i];
                if (line.trim() === '') continue;
                
                const [country, currency, amount, code, rate] = line.split('|');
                exchangeRates.push(this.exchangeRateRepository.create({
                    country: country.trim(),
                    currency: currency.trim(),
                    amount: parseInt(amount.trim(), 10),
                    code: code.trim(),
                    rate: parseFloat(rate.trim()),
                    timestamp: now,
                }));
            }
            await this.exchangeRateRepository.save(exchangeRates);
            return exchangeRates;
            // return JSON.stringify(exchangeRates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            // return "Oops, something went wrong!"
            throw new Error("Oops, something went wrong!");
        }
    };
}
