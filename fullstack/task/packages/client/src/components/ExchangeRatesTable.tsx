import React from 'react';
import { Cell, Column, HeaderGroup, Row, useTable } from 'react-table';

interface ExchangeRate {
    country: string;
    currency: string;
    amount: number;
    code: string;
    rate: number;
}

interface Props {
    exchangeRates: ExchangeRate[];
}

const ExchangeRatesTable: React.FC<Props> = ({ exchangeRates }) => {
    const data = React.useMemo(() => exchangeRates, [exchangeRates]);

    const columns: Column<ExchangeRate>[] = React.useMemo(
        () => [
            { Header: 'Country', accessor: 'country' },
            { Header: 'Currency', accessor: 'currency' },
            { Header: 'Amount', accessor: 'amount' },
            { Header: 'Code', accessor: 'code' },
            { Header: 'Rate', accessor: 'rate' },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable<ExchangeRate>({ columns, data });

    return (
        <table
            {...getTableProps()}
            style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '20px',
            }}
        >
            <thead>
                {headerGroups.map((headerGroup: HeaderGroup<ExchangeRate>) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps()}
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    background: '#f2f2f2',
                                }}
                            >
                                {column.render('Header') as React.ReactNode}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row: Row<ExchangeRate>) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell: Cell<ExchangeRate>) => (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '8px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {cell.render('Cell') as React.ReactNode}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default ExchangeRatesTable;
