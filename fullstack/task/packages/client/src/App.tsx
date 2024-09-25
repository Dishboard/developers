import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Header, Error } from './components';
import { Skeleton } from './components/ui/skeleton';
import { ExchangeRates, ExchangeRate, columns } from './modules';
import './index.css';

const exchangeRatesQuery = gql`
    query getRates {
        exchangeRates {
            id
            version
            createdAtUtc
            country
            code
            currency
            rate
            amount
        }
    }
`;

function App() {
    const { loading, error, data } = useQuery<{ exchangeRates: ExchangeRate[] }>(
        exchangeRatesQuery
    );

    return (
        <div className="mx-auto max-w-screen-xl p-6">
            <Header />

            <div className="mt-10">
                {(loading &&
                    new Array(30)
                        .fill('')
                        .map(() => <Skeleton className="w-full h-[30px] my-2" />)) ||
                    (error && (
                        <Error>
                            {error.message} ({error.name})
                        </Error>
                    )) || <ExchangeRates columns={columns} data={data?.exchangeRates || []} />}
            </div>
        </div>
    );
}

export default App;
