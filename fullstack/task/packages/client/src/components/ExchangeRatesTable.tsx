import React, {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { GET_EXCHANGE_RATES } from './getExchangeRageQuery';

const ExchangeRatesTable: React.FC = () => {
  const { loading, error, data } = useQuery(GET_EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  
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
        {data.exchangeRates.map((rate: any, index: number) => (
          <tr key={index}>
            <td>{rate.country}</td>
            <td>{rate.currency}</td>
            <td>{rate.amount}</td>
            <td>{rate.code}</td>
            <td>{rate.rate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExchangeRatesTable;