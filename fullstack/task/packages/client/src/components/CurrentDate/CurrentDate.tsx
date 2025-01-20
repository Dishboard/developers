import type React from "react"

export const CurrentDate: React.FC = () => {
    const today = new Date()
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return <div className="text-gray-600 dark:text-gray-400 text-sm">{formattedDate}</div>
}
