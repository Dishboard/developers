import type React from "react"
import { CurrencyRateList } from "./components/CurrencyRateList/CurrencyRateList"
import { ThemeSwitcher } from "./components/ThemeSwitcher/ThemeSwitcher"
import { CurrentDate } from "./components/CurrentDate/CurrentDate"
import { ThemeProvider } from "./context/ThemeContext"
import "./global.css"

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
                <div className="container mx-auto px-4 py-8">
                    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Czech National Bank Currency Rates</h1>
                        <div className="flex items-center space-x-4">
                            <CurrentDate />
                            <ThemeSwitcher />
                        </div>
                    </header>
                    <main className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
                        <CurrencyRateList />
                    </main>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App