import React, {useEffect, useState} from 'react';
import { useQuery } from '@apollo/client';
import { GET_EXCHANGE_RATES } from './getExchangeRageQuery';

const ExchangeRatesTable: React.FC = () => {
  const { loading, error, data } = useQuery(GET_EXCHANGE_RATES);
  const [timeSinceFetch, setTimeSinceFetch] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const fetchTime = new Date(data.exchangeRates[0].timestamp);
      const now = new Date();
      const timeDiff = Math.floor((now.getTime() - fetchTime.getTime()) / 1000); 

      const minutes = Math.floor(timeDiff / 60);

      setTimeSinceFetch(minutes);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  
  return (
    <div>
      <p>Rates fetched: {timeSinceFetch} minutes ago</p>
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
    </div>
  );
};

export default ExchangeRatesTable;