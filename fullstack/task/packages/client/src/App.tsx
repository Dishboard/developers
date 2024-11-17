import React, { CSSProperties, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Table } from './components/Table';
import { getExchangeRatesQuery } from './queries/getExchangeRatesQuery';
import { calculateDifference } from './utils/calculateDateDifference';

const App = () => {
    const { loading, error, data } = useQuery(getExchangeRatesQuery);

    const timestamp = data?.exchangeRates?.timestamp;
    const headers = ['Country', 'Currency', 'Amount', 'Code', 'Rate'];

    const [lastFetchedMinutes, setLastFetchedMinutes] = useState(0);
    const [lastFetchedSeconds, setLastFetchedSeconds] = useState(0);

    useEffect(() => {
        const { minutes, seconds } = calculateDifference(new Date(timestamp), new Date());
        setLastFetchedMinutes(minutes);
        setLastFetchedSeconds(seconds);

        const interval = setInterval(() => {
            setLastFetchedSeconds((prevSeconds) => {
                if (prevSeconds === 59) {
                    setLastFetchedMinutes((prevMinutes) => prevMinutes + 1);
                    return 0;
                }
                return prevSeconds + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timestamp]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div style={containerStyle}>
            <div style={headingStyle}>
                <div style={headingContent}>
                    <strong>Exchange rates</strong>
                    <strong>Last fetch: {`${lastFetchedMinutes}m ${lastFetchedSeconds}s`}</strong>
                </div>
            </div>
            <Table headers={headers} rows={data.exchangeRates.data} />
        </div>
    );
};
// Styles here for simplification
const containerStyle: CSSProperties = {
    height: '100vh',
    overflow: 'auto',
};

const headingContent: CSSProperties = {
    justifyContent: 'space-between',
    display: 'flex',
};

const headingStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    padding: '10px 16px',
    background: '#555',
    color: '#f1f1f1',
    textAlign: 'center',
    zIndex: 2,
};

export default App;
