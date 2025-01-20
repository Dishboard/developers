import type React from "react"
import { CurrencyRate } from "../../services/graphqlService"
import { capitalizeFirstLetter } from "src/utils/string-utils"

interface CurrencyRateItemProps {
    rate: CurrencyRate
}

export const CurrencyRateItem: React.FC<CurrencyRateItemProps> = ({ rate }) => {
    return (
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex-1 text-center">{rate.currencyCode}</span>
            <span className="flex-grow mx-4 text-gray-700 dark:text-gray-300 flex-1 text-center">{capitalizeFirstLetter(rate.currency)}</span>
            <span className="text-gray-500 dark:text-gray-400 flex-1 text-center">{rate.country}</span>
            <span className="font-bold text-green-600 dark:text-green-400 flex-1 text-center">{rate.amount}</span>
            <span className="font-bold text-green-600 dark:text-green-400 flex-1 text-center">{rate.rate.toFixed(3)}</span>
        </div>
    )
}

