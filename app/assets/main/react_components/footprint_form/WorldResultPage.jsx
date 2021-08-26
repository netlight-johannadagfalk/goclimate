import React from 'react'
import ResultTitle from '../footprint_result/ResultTitle.jsx'
import YourFootprintText from '../footprint_result/YourFootprintText.jsx'
import WorldComparisonChart from '../footprint_result/WorldComparisonChart.jsx'

const WorldResultPage = ({ footprint, countryAverage, texts, lang }) => {
    
    return (
        <div>
            <ResultTitle
                title={texts.registrationsText.well_done}
            />
            <YourFootprintText
                footprintText={{
                    heading: texts.commonText.dashboard.footprint.heading,
                    tonnes_CO2: texts.commonText.tonnes_CO2
                }} 
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

export default WorldResultPage
