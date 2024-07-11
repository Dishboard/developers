import React from 'react';
import {
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

const TABLE_CELL_WIDTH = 100;
const TABLE_CELL_HEIGHT = 30;
const NUM_COLUMNS = 5;

const TableCellSkeleton = () => (
    <TableCell>
        <Skeleton
            variant="text"
            animation="wave"
            height={TABLE_CELL_HEIGHT}
            width={TABLE_CELL_WIDTH}
        />
    </TableCell>
);

type ExchangeRatesTableSkeletonProps = {
    rows: number;
};
export const ExchangeRatesTableSkeleton = ({ rows }: ExchangeRatesTableSkeletonProps) => {
    const rowsIterable = Array.from(new Array(rows));
    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableCell>Country</TableCell>
                        <TableCell>Currency</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Currency Code</TableCell>
                        <TableCell align="right">Rate</TableCell>
                    </TableHead>
                    <TableBody>
                        {rowsIterable.map((_, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <TableRow key={`table-row-${index}`}>
                                {Array.from(new Array(NUM_COLUMNS)).map((_, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <TableCellSkeleton key={`table-cell-${index}`} />
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
