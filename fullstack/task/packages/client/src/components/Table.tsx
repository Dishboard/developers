import React, { CSSProperties } from 'react';
import { CurrencyData } from '../interfaces';

export const Table = ({ rows, headers }: { rows: CurrencyData[]; headers: string[] }) => {
    return (
        <div style={tableWrapperStyle}>
            <table style={tableStyle}>
                <thead style={theadStyle}>
                    <tr>
                        {headers.map((header) => (
                            <th key={header} style={headerCellStyle}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.code} style={index % 2 === 0 ? rowStyleEven : rowStyleOdd}>
                            <td style={cellStyle}>{row.country}</td>
                            <td style={cellStyle}>{row.currency}</td>
                            <td style={cellStyle}>{row.amount}</td>
                            <td style={cellStyle}>{row.code}</td>
                            <td style={cellStyle}>{row.rate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Styles here for simplification
const tableWrapperStyle: CSSProperties = {
    marginTop: '10px',
};

const tableStyle: CSSProperties = {
    borderCollapse: 'collapse',
    width: '100%',
};

const theadStyle: CSSProperties = {
    position: 'sticky',
    top: 40, // Sticks below the h2 heading
    backgroundColor: '#f2f2f2',
    zIndex: 1,
};

const headerCellStyle: CSSProperties = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'left',
    fontWeight: 'bold',
};

const cellStyle: CSSProperties = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'left',
};

const rowStyleEven: CSSProperties = {
    backgroundColor: '#f9f9f9',
};

const rowStyleOdd: CSSProperties = {
    backgroundColor: 'white',
};
