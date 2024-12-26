import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class ExchangeRateService {
    public getExchangeRates = async (): Promise<string>  => {
        
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
                exchangeRates.push({
                    country: country.trim(),
                    currency: currency.trim(),
                    amount: parseInt(amount.trim(), 10),
                    code: code.trim(),
                    rate: parseFloat(rate.trim())
                });
            }
            return JSON.stringify(exchangeRates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            return "Oops, something went wrong!";
        }
    };
}
