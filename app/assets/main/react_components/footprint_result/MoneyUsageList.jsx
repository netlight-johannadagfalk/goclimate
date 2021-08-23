import React from 'react'

const MoneyUsageList = ({ moneyUsageText }) => {
    const listValues = Object.entries(moneyUsageText).filter(([key]) => key !== "heading")

    return (
        <div className="m-lg:w-1/2 m-lg:pr-16 space-y-3">
            <h3 className="font-semibold">{moneyUsageText.heading}</h3>
            <ul className="list-check space-y-3">
                {
                    listValues.map(([key, val]) => <li key={key}>{val}</li>)
                }
            </ul>
        </div>
    )
}

export default MoneyUsageList
