import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useExchangeRatesQuery } from './generated/graphql';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
`;

const GridHeader = styled.div`
    font-weight: bold;
    padding: 10px;
    background-color: #f2f2f2;
`;

const GridCell = styled.div<{ index: number }>`
    padding: 10px;
    background-color: ${(props) => (props.index % 2 !== 0 ? '#f2f2f2' : '#ffffff')};
`;

const interval = 1000 * 60 * 5; // 5 mins

function App() {
    const { data, loading, error, startPolling, stopPolling } = useExchangeRatesQuery();

    useEffect(() => {
        startPolling(interval);
        return () => {
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    const fetchedTime = data?.getExchangeRates.length
        ? new Date(data.getExchangeRates[0].updatedAt).toLocaleString()
        : '';
    return (
        <div className="container">
            <h3> Latest Exchange Rates Czech National Bank: {data?.getExchangeRates.length} </h3>
            <Grid>
                <GridHeader>Country</GridHeader>
                <GridHeader>Currency</GridHeader>
                <GridHeader>Amount</GridHeader>
                <GridHeader>Code</GridHeader>
                <GridHeader>Rate</GridHeader>
                {loading ? <div>Loading...</div> : null}
                {data?.getExchangeRates.map((r, index) => (
                    <React.Fragment key={r.code}>
                        <GridCell index={index}>{r.country}</GridCell>
                        <GridCell index={index}>{r.currency}</GridCell>
                        <GridCell index={index}>{r.amount}</GridCell>
                        <GridCell index={index}>{r.code}</GridCell>
                        <GridCell index={index}>{r.rate}</GridCell>
                    </React.Fragment>
                ))}
                {error ? error.message : null}
            </Grid>

            <p>Last fetched: {fetchedTime}</p>
        </div>
    );
}

export default App;
