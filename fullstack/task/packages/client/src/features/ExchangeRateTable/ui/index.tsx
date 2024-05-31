// src/components/ExchangeRateTable.tsx
import { FC } from 'react';
import { useQuery } from '@apollo/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ExchangeRateRecord } from '../../../graphql/queries/exchangeRates';

interface ExchangeRateTableProps {
    data: ExchangeRateRecord[];
}

const ExchangeRateTable: FC<ExchangeRateTableProps> = ({ data }) => {
    if (!data.length) return <p>No currency data available(</p>;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="exchange rate table">
                <TableHead sx={{ backgroundColor: '#2b3033' }}>
                    <TableRow>
                        <TableCell
                            sx={{ minWidth: 400, flexGrow: 1, color: '#fff', fontSize: '18px' }}
                        >
                            Country
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{
                                minWidth: '100px',
                                maxWidth: '100px',
                                color: '#fff',
                                fontSize: '18px',
                            }}
                        >
                            Currency
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{
                                minWidth: '100px',
                                maxWidth: '100px',
                                color: '#fff',
                                fontSize: '18px',
                            }}
                        >
                            Amount
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{
                                minWidth: '100px',
                                maxWidth: '100px',
                                color: '#fff',
                                fontSize: '18px',
                            }}
                        >
                            Code
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{
                                minWidth: '100px',
                                maxWidth: '100px',
                                color: '#fff',
                                fontSize: '18px',
                            }}
                        >
                            Rate
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((rate: any) => (
                        <TableRow key={rate.code}>
                            <TableCell
                                component="th"
                                scope="row"
                                sx={{ minWidth: 400, flexGrow: 1 }}
                            >
                                {rate.country}
                            </TableCell>
                            <TableCell align="right" sx={{ minWidth: 100 }}>
                                {rate.currency}
                            </TableCell>
                            <TableCell align="right" sx={{ minWidth: 100 }}>
                                {rate.amount}
                            </TableCell>
                            <TableCell align="right" sx={{ minWidth: 100 }}>
                                {rate.code}
                            </TableCell>
                            <TableCell align="right" sx={{ minWidth: 100 }}>
                                {rate.rate}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ExchangeRateTable;
