import { useQuery } from '@apollo/client';
import { ExchangeRate } from '../types/ExchangeRate';
import { GET_EXCHANGE_RATES } from '../queries/exchange-rates';
import { ExchangeRateRow } from './ExchangeRate.Row';

const UPDATE_INTERVAL = 5 * 60000;

type QueryResponse = {
    exchangeRates: ExchangeRate[];
};

export const ExchangeRatesTable = () => {
    const { data, loading, error } = useQuery<QueryResponse>(GET_EXCHANGE_RATES, {
        pollInterval: UPDATE_INTERVAL,
    });

    if (loading) return <h1>Loading...</h1>;
    if (error || !data) return <p>Error loading exchange rates!</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>Country</th>
                    <th>Currency</th>
                    <th>Amount</th>
                    <th>Code</th>
                    <th>Rate</th>
                </tr>
            </thead>
            <tbody>
                {data.exchangeRates.map((elem: ExchangeRate) => (
                    <ExchangeRateRow key={elem.id} {...elem} />
                ))}
            </tbody>
        </table>
    );
};
