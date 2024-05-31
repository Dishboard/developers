import { useQuery } from '@apollo/client';
import ExchangeRateTable from '../features/ExchangeRateTable/ui';
import { GET_EXCHANGE_RATES, GET_EXCHANGE_RATES_RESPONSE } from '../graphql/queries/exchangeRates';
import ExchangeRateHeader from '../features/ExchangeRateHeader/ui';

const App = () => {
    const { loading, error, data, refetch } =
        useQuery<GET_EXCHANGE_RATES_RESPONSE>(GET_EXCHANGE_RATES);

    if (loading) {
        return <p>Still loading</p>;
    }

    if (error) {
        return <p>Sorry but today you will have to visit bank department :D</p>;
    }

    return (
        <>
            <ExchangeRateHeader
                lastUpdated={data.getExchangeRates[0].updatedAtUtc}
                refetch={refetch}
            />
            <ExchangeRateTable data={data.getExchangeRates} />
        </>
    );
};

export default App;
