import React from 'react'

/**
 * Result text for your footprint
 * Includes a heading and the footprint result in tonnes
 */
const YourFootprintText = ({ footprintText, footprintValue }) => {

    return (
        <div>
            <h2 className="text-sm">{footprintText.heading}</h2>
            <div className="mt-1">
                <span className="text-xl font-bold text-green-accent">{footprintValue}</span>
                <span className="text-lg font-semibold"> {footprintText.tonnes_CO2}</span>
            </div>
        </div>
    )
}

export default YourFootprintText
