import { ColumnDef } from '@tanstack/react-table';
import { ExchangeRate } from './ExchangeRates.types';

export const columns: ColumnDef<ExchangeRate>[] = [
    {
        accessorKey: 'country',
        header: 'Country',
        enableSorting: true,
    },
    {
        accessorKey: 'currency',
        header: 'Currency',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
    },
    {
        accessorKey: 'code',
        header: 'Code',
    },
    {
        accessorKey: 'rate',
        header: 'Rate',
    },
];
