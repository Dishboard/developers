import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import Table from '../components/Table';
import { ExchangeRate } from '../types/exchange-rates.types';
import { EXCHANGE_RATES_QUERY } from '../graphql/exchange-rates';

const HomePage = () => {
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
    const [pollInterval, setPollInterval] = useState<number | undefined>(undefined);

    const { loading, error, data } = useQuery(EXCHANGE_RATES_QUERY, {
        fetchPolicy: 'cache-and-network',
        pollInterval: pollInterval,
    });

    useEffect(() => {
        if (data && data.exchangeRates) {
            setExchangeRates(data.exchangeRates);

            const lastUpdate = data.exchangeRates[0]?.createdAtUtc;

            if (lastUpdate) {
                const nextRefreshTime = lastUpdate + 5 * 60 * 1000;
                const currentTime = Date.now();

                if (nextRefreshTime > currentTime) {
                    const remainingTime = nextRefreshTime - currentTime;
                    setPollInterval(remainingTime);
                } else {
                    setPollInterval(300000);
                }
            }
        }
    }, [data]);

    const formatMillisecondsToLocalDate = (milliseconds: number): string => {
        const date = new Date(milliseconds);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="grid grid-cols-4 grid-rows-[100px_auto]">
            <div className="col-span-4 m-4 sm:m-10">
                {loading && <p>Loading...</p>}
                {error && <p>Error fetching data: {error.message}</p>}
                {!error && !loading && exchangeRates.length > 0 ? (
                    <h1>{`Last update of exchange rates was at ${formatMillisecondsToLocalDate(exchangeRates[0]?.createdAtUtc)} ${pollInterval}`}</h1>
                ) : (
                    !loading && <h1>No exchange rates available.</h1>
                )}
            </div>
            <div className="col-span-4 m-4 sm:m-10">
                <Table data={exchangeRates} />
            </div>
        </div>
    );
};

export default HomePage;
