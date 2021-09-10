import React from 'react'
import Title from './Title.jsx'
import YourFootprintText from '../footprint_result/YourFootprintText.jsx'
import WorldComparisonChart from '../footprint_result/WorldComparisonChart.jsx'

/**
 * Result component page for world comparison
 */
const WorldPage = ({ footprint, countryAverage, texts, lang, price, currency }) => {
    return (
        <div className="max-w-lg mx-auto">
            <Title 
                text={texts.registrationsText.well_done}
            />
            <YourFootprintText
                footprintText={{
                    heading: texts.commonText.dashboard.footprint.heading,
                    tonnes_CO2: texts.commonText.tonnes_CO2
                }} 
                currency={currency}
                priceObject={price}
                footprintValue={(footprint.total.co2e / 1000).toFixed(1)}
            />
            <WorldComparisonChart 
                footprint={footprint}
                countryAverage={countryAverage}
                worldComparisonText={{...texts.registrationsText, ...texts.commonText, ...texts.modelText}}
                lang={lang}
            />
        </div>
    )
}

export default WorldPage
