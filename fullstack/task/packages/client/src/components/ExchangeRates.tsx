import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EXCHANGE_RATES } from '../graphql/queries';
import { getRelativeTimeWithSeconds, isDataStale } from '../utils/time'

type ExchangeRate = {
  id: string;
  country: string;
  currency: string;
  amount: string;
  currencyCode: string;
  rate: string;
  updatedAtUtc: string; // ISO date string
};

const ExchangeRates: React.FC = () => {
  const { loading, error, data, refetch } = useQuery<{ exchangeRates: ExchangeRate[] }>(GET_EXCHANGE_RATES);

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [relativeTime, setRelativeTime] = useState<string | null>(null); // New state to track relative time

  // Update last updated time whenever data changes
  useEffect(() => {
    if (data && data.exchangeRates.length > 0) {
      const latestUpdate = data.exchangeRates[0].updatedAtUtc;
      setLastUpdated(latestUpdate);

      
    }
  }, [data]);

  // Set interval to update relative time every second
  useEffect(() => {
    if (lastUpdated) {
      // Update the relative time immediately
      setRelativeTime(getRelativeTimeWithSeconds(lastUpdated));

      // Set an interval to update the relative time every second
      const interval = setInterval(() => {
        setRelativeTime(getRelativeTimeWithSeconds(lastUpdated));
        // If the data is more than 5 minutes old, trigger a refetch
      if (isDataStale(lastUpdated)) {
        refetch().then((response: { data: {exchangeRates: ExchangeRate[]} }) => {
            if (response.data && response.data.exchangeRates.length > 0) {
              const newUpdate = response.data.exchangeRates[0].updatedAtUtc;
              setLastUpdated(newUpdate); // Reset the last updated time
            }
          });
      }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastUpdated, refetch]); // Only run when lastUpdated changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {/* Display last updated time outside of the table */}
      {relativeTime && <p>Last Updated: {relativeTime}</p>}

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Country</th>
            <th>Currency</th>
            <th>Amount</th>
            <th>Currency Code</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {data?.exchangeRates.map((rate) => (
            <tr key={rate.id}>
              <td>{rate.country}</td>
              <td>{rate.currency}</td>
              <td>{rate.amount}</td>
              <td>{rate.currencyCode}</td>
              <td>{rate.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExchangeRates;
