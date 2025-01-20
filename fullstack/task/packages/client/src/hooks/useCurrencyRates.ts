import { useState, useEffect } from "react"
import { CurrencyRate, fetchCurrencyRates } from "../services/graphqlService"

export const useCurrencyRates = () => {
    const [rates, setRates] = useState<CurrencyRate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const loadRates = async () => {
            try {
                const data = await fetchCurrencyRates()
                setRates(data)
                setLoading(false)
            } catch (err) {
                setError(err as Error)
                setLoading(false)
            }
        }

        loadRates()
    }, [])

    return { rates, loading, error }
}

