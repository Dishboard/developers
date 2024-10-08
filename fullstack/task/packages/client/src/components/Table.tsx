import { FC } from 'react';
import { ExchangeRate } from '../types/exchange-rates.types';

interface TableProps {
    data: ExchangeRate[];
}

const Table: FC<TableProps> = ({ data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left uppercase text-gray-600 tracking-wider">
                        <th className="px-6 py-4 border-b">Country</th>
                        <th className="px-6 py-4 border-b">Currency</th>
                        <th className="px-6 py-4 border-b">Amount</th>
                        <th className="px-6 py-4 border-b">Code</th>
                        <th className="px-6 py-4 border-b">Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-50"
                        >
                            <td className="px-6 py-4">{item.country}</td>
                            <td className="px-6 py-4">{item.currencyCode}</td>
                            <td className="px-6 py-4">{item.amount}</td>
                            <td className="px-6 py-4">{item.currencyCode}</td>
                            <td className="px-6 py-4">{item.rate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
