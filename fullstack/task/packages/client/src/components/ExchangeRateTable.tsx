import React from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { GET_EXCHANGE_RATES } from '../graphql/queries';
import { ExchangeRate } from '../types/exchange-rate';

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
`;

const Th = styled.th`
    background-color: #f4f4f4;
    padding: 12px;
    text-align: left;
    border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
    padding: 12px;
    border-bottom: 1px solid #ddd;
`;

const LastUpdated = styled.div`
    margin: 20px 0;
    color: #666;
`;

const Container = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const LoadingError = styled.div`
    padding: 20px;
    text-align: center;
    color: #666;
`;

export const ExchangeRateTable: React.FC = () => {
    const { loading, error, data } = useQuery(GET_EXCHANGE_RATES);

    if (loading) return <LoadingError>Loading...</LoadingError>;
    if (error) return <LoadingError>Error: {error.message}</LoadingError>;

    const rates: ExchangeRate[] = data.exchangeRates;
    const lastUpdated = new Date(rates[0]?.lastUpdated);
    const timeAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000 / 60);

    return (
        <Container>
            <LastUpdated>Last updated: {timeAgo} minutes ago</LastUpdated>
            <Table>
                <thead>
                    <tr>
                        <Th>Country</Th>
                        <Th>Currency</Th>
                        <Th>Amount</Th>
                        <Th>Code</Th>
                        <Th>Rate</Th>
                    </tr>
                </thead>
                <tbody>
                    {rates.map((rate) => (
                        <tr key={`${rate.code}-${rate.country}`}>
                            <Td>{rate.country}</Td>
                            <Td>{rate.currency}</Td>
                            <Td>{rate.amount}</Td>
                            <Td>{rate.code}</Td>
                            <Td>{rate.rate}</Td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};
