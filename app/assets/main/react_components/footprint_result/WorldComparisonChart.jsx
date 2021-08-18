import React from 'react'
import ResultBar from './ResultBar.jsx';

const WorldComparisonChart = ({ footprint, countryAverage, worldComparisonText, lang }) => {
    const maxValue = Math.max(footprint.total.co2e, countryAverage.co2e.co2e, 2500)
    return (
        <>
            <ResultBar 
                title={{text: worldComparisonText.you + " <-"}}
                width={(footprint.total.co2e / 1000).toFixed(1) > 0 ? footprint.total.co2e / maxValue * 100 : 0} 
                value={(footprint.total.co2e / 1000).toFixed(1)}
                color={"bg-green-accent"}
                fontWeight={"font-bold"}
            />
            <ResultBar 
                title={{text: countryAverage.countries ? 
                        worldComparisonText.average_in.replace('%{region}', footprint.country.data.translations[lang])
                        : worldComparisonText.world_average}}
                width={(countryAverage.co2e.co2e / 1000).toFixed(1) > 0 ? countryAverage.co2e.co2e / maxValue * 100 : 0} 
                value={(countryAverage.co2e.co2e / 1000).toFixed(1)}
            />
            <ResultBar 
                title={{text: worldComparisonText.goal_2030}}
                width={2500 / maxValue * 100} 
                value={2.5}
            />
        </>
    )
}

export default WorldComparisonChart;
