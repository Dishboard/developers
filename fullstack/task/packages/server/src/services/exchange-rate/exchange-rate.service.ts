/* eslint-disable dot-notation */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { ExchangeRate } from '../../entities';

interface ExchangeRateData {
    $: {
        kod: string;
        kurz: string;
        mena: string;
        mnozstvi: string;
        zeme: string;
    };
}
@Injectable()
export class ExchangeRateService {
    public getExchangeRates = async (): Promise<ExchangeRate[]> => {
        try {
            const response = await axios.get(
                'https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml'
            );
            const xmlData = response.data;

            const parsedData = (await xml2js.parseStringPromise(xmlData)) as any;
            const radeks: ExchangeRateData[] = parsedData.kurzy.tabulka[0].radek;

            const exchangeRates = radeks.map((radek: ExchangeRateData) => ({
                code: radek['$'].kod,
                rate: radek['$'].kurz,
                amount: Number(radek['$'].mnozstvi),
                currency: radek['$'].mena,
                country: radek['$'].zeme,
            })) as ExchangeRate[];

            return exchangeRates;
        } catch (err) {
            console.error('Error fetching exchange rates:', err);
            throw new Error('Failed to fetch exchange rates');
        }
    };
}
