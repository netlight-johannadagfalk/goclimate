import React from 'react'

/**
 * Displays a list explaining what donated money goes to
 */
const MoneyUsageList = ({ moneyUsageText }) => {
    const listValues = Object.entries(moneyUsageText).filter(([key]) => key !== "heading")

    return (
        <div className="space-y-3">
            <h3 className="font-semibold">{moneyUsageText.heading}</h3>
            <ul className="list-check space-y-3 text-left">
                {listValues.map(([key, text]) => <li key={key}>{text}</li>)}
            </ul>
        </div>
    )
}

export default MoneyUsageList
