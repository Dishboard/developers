import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EXCHANGE_RATES } from './getExchangeRageQuery';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';

const ExchangeRatesTable: React.FC = () => {
    const { loading, error, data } = useQuery(GET_EXCHANGE_RATES);
    const [timeSinceFetch, setTimeSinceFetch] = useState<string>('');

    useEffect(() => {
        if (data) {
            const fetchTime = new Date(data.exchangeRates[0].timestamp);
            const now = new Date();
            const timeDiff = Math.floor((now.getTime() - fetchTime.getTime()) / 60000);
            setTimeSinceFetch(timeDiff == 0 ? 'now' : `${timeDiff} minutes ago`);
        }
    }, [data]);

    if (error) return <Alert severity="error">Error: {error.message}</Alert>;

    return (
        <Container>
            {loading ? (
                <Container
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress />
                </Container>
            ) : (
                <>
                    <Typography variant="h6" gutterBottom>
                        Rates fetched: {timeSinceFetch}
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: '85vh' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Country</TableCell>
                                    <TableCell>Currency</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Code</TableCell>
                                    <TableCell>Rate</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.exchangeRates.map((rate: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{rate.country}</TableCell>
                                        <TableCell>{rate.currency}</TableCell>
                                        <TableCell>{rate.amount}</TableCell>
                                        <TableCell>{rate.code}</TableCell>
                                        <TableCell>{rate.rate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Container>
    );
};

export default ExchangeRatesTable;
