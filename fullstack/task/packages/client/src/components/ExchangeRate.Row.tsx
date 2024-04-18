import { ExchangeRate } from '../types/ExchangeRate';

export const ExchangeRateRow: React.FC<ExchangeRate> = ({
    amount,
    country,
    rate,
    currency,
    currencyCode,
}) => {
    return (
        <tr>
            <td>{country}</td>
            <td>{currency}</td>
            <td>{amount}</td>
            <td>{currencyCode}</td>
            <td>{rate}</td>
        </tr>
    );
};
