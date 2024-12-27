import React, { useEffect, useState } from 'react';
import ExchangeRatesTable from '../components/ExchangeRatesTable';
import { ExchangeRate, fetchExchangeRates } from '../services/exchangeRateService';

const ExchangeRatesPage: React.FC = () => {
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    useEffect(() => {
        const getExchangeRates = async () => {
            const data = await fetchExchangeRates();
            setExchangeRates(data?.exchangeRates?.rates || []);
            setLastFetched(
                data?.exchangeRates?.lastFetched ? new Date(data.exchangeRates.lastFetched) : null
            );
        };

        getExchangeRates();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Exchange Rates</h1>
            {lastFetched && <p>Last fetched: {lastFetched.toLocaleTimeString()}</p>}
            <ExchangeRatesTable exchangeRates={exchangeRates} />
        </div>
    );
};

export default ExchangeRatesPage;
