import { gql, useQuery } from "@apollo/client";

const GET_EXCHANGE_RATES = gql`
  query GetExchangeRates {
    exchangeRates {
      country
      currency
      amount
      code
      rate
      createdAtUtc
    }
  }
`;

type ExchangeRate = {
    country: string
    currency: string
    amount: number
    code: string
    rate: number
    createdAt: Date
}

function App() {
    const { loading, error, data } = useQuery(GET_EXCHANGE_RATES);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    const updateDate = new Date(data.exchangeRates[0].createdAtUtc);

    return <div>
        <h1>Exchange Rates</h1>
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
            {data.exchangeRates.map(({country, currency, amount, code, rate}: ExchangeRate) => (
                <tr key={code}>
                    <td>{country}</td>
                    <td>{currency}</td>
                    <td>{amount}</td>
                    <td>{code}</td>
                    <td>{rate}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <p>Updated on {updateDate.toDateString()} at {updateDate.toTimeString()}</p>
    </div>;
}

export default App;
