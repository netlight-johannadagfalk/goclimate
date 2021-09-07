import React from 'react'
import { useTexts } from '../context/Footprint/StaticDataContext'

/**
 * Displays a list explaining what donated money goes to
 */
const MoneyUsageList = () => {
    const listValues = Object.entries(useTexts().registrationsText.where_does_the_money_go).filter(([key]) => key !== "heading")

    return (
        <div className="space-y-3">
            <h3 className="font-semibold">{useTexts().registrationsText.where_does_the_money_go.heading}</h3>
            <ul className="list-check space-y-3 text-left">
                {listValues.map(([key, text]) => <li key={key}>{text}</li>)}
            </ul>
        </div>
    )
}

export default MoneyUsageList
