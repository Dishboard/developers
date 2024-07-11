import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import { ExchangeRate } from '../types';

interface ExchangeRatesTableProps {
    rates: ExchangeRate[];
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isLoading?: boolean;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export const ExchangeRatesTable: React.FC<ExchangeRatesTableProps> = ({
    rates,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const paginatedRates = rates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Country</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Currency Code</TableCell>
                            <TableCell align="right">Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRates.map((rate) => (
                            <TableRow key={rate.id}>
                                <TableCell>{rate.country}</TableCell>
                                <TableCell component="th" scope="row">
                                    {rate.currency}
                                </TableCell>
                                <TableCell align="right">{rate.amount.toFixed(2)}</TableCell>
                                <TableCell>{rate.currencyCode}</TableCell>
                                <TableCell align="right">{rate.rate.toFixed(4)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={rates.length}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            />
        </Paper>
    );
};
