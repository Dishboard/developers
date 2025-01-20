import type React from "react"
import { CurrencyRateItem } from "../CurrencyRateItem/CurrencyRateItem"
import { useCurrencyRates } from "../../hooks/useCurrencyRates"
import { CurrencyRate } from "src/services/graphqlService"

export const CurrencyRateList: React.FC = () => {
    const { rates, loading, error } = useCurrencyRates()

    if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>
    if (error) return <div className="text-center py-8 text-red-600 dark:text-red-400">Error: {error.message}</div>

    if (rates.length === 0) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">No currency rates available.</div>;

    const firstRate = rates[0];

    const lastUpdated = new Date(firstRate.createdAtUtc).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    const now = new Date();
    const timeElapsed = Math.floor((now.getTime() - new Date(firstRate.createdAtUtc).getTime()) / 1000);

    const formatTimeElapsed = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day(s) ago`;
        if (hours > 0) return `${hours} hour(s) ago`;
        if (minutes > 0) return `${minutes} minute(s) ago`;
        return `${seconds} second(s) ago`;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center font-bold text-gray-700 dark:text-gray-300 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="w-1/4 text-center">Currency Code</span>
                <span className="w-1/4 text-center">Name</span>
                <span className="w-1/4 text-center">Country</span>
                <span className="w-1/4 text-center">Amount</span>
                <span className="w-1/4 text-center">Rate</span>
            </div>
            {rates.map((rate: CurrencyRate) => (
                <CurrencyRateItem key={rate.currencyCode} rate={rate} />
            ))}
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-4">Last updated: {lastUpdated}  ({formatTimeElapsed(timeElapsed)})</div>
        </div>
    )
}

