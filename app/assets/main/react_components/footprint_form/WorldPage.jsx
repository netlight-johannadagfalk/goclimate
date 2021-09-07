import React from 'react'
import Title from './Title.jsx'
import YourFootprintText from '../footprint_result/YourFootprintText.jsx'
import WorldComparisonChart from '../footprint_result/WorldComparisonChart.jsx'
import { useTexts } from '../context/Footprint/StaticDataContext.js'

/**
 * Result component page for world comparison
 */
const WorldPage = ({ footprint, countryAverage }) => {
    return (
        <div className="max-w-lg mx-auto">
            <Title 
                text={useTexts().registrationsText.well_done}
            />
            <YourFootprintText
                footprintValue={(footprint.total.co2e / 1000).toFixed(1)}
            />
            <WorldComparisonChart 
                footprint={footprint}
                countryAverage={countryAverage}
            />
        </div>
    )
}

export default WorldPage
