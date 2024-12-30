import { useQuery } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Loader } from './components/loader/Loader';
import { ExchangeRate, GET_EXCHANGE_RATES } from './graphql/queries/exchange-rates';

export const ExchangeRates = () => {
    const { data, loading, error } = useQuery(GET_EXCHANGE_RATES);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState<string>(`Last updated just now`);

    useEffect(() => {
        if (data) {
            setLastFetched(new Date());
        }
    }, [data]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (lastFetched) {
                const timeDiff = new Date().getTime() - lastFetched.getTime();
                const minutesAgo = Math.floor(timeDiff / 1000 / 60);
                setElapsedTime(`Last fetched ${minutesAgo} minute(s) ago`);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [lastFetched]);

    if (loading) return <Loader />;

    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Exchange Rates
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                {elapsedTime}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Country</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Currency Code</TableCell>
                            <TableCell>Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.exchangeRates.map((rate: ExchangeRate) => (
                            <TableRow key={rate.currencyCode}>
                                <TableCell>{rate.country}</TableCell>
                                <TableCell>{rate.currency}</TableCell>
                                <TableCell>{rate.amount}</TableCell>
                                <TableCell>{rate.currencyCode}</TableCell>
                                <TableCell>{rate.rate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
