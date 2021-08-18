import React from 'react'
import ResultBar from './ResultBar.jsx';

const WorldComparisonChart = ({ footprint, countryAverage, worldComparisonText, lang }) => {
    const maxValue = Math.max(footprint.total.co2e, countryAverage.co2e.co2e, 2.5);

    return (
        <>
            <ResultBar 
                title={{text: worldComparisonText.you + " <-"}}
                width={Math.round(footprint.total.co2e / maxValue * 100).toFixed(1)} 
                value={(Math.round(footprint.total.co2e / 100) / 10).toFixed(1)}
                color={"bg-green-accent"}
                fontWeight={"font-bold"}
            />
            <ResultBar 
                title={{text: countryAverage.countries ? 
                        worldComparisonText.average_in.replace('%{region}', footprint.country.data.translations[lang])
                        : worldComparisonText.world_average}}
                width={Math.round(countryAverage.co2e.co2e / maxValue * 100).toFixed(1)} 
                value={(Math.round(countryAverage.co2e.co2e / 100) / 10).toFixed(1)}
            />
            <ResultBar 
                title={{text: worldComparisonText.goal_2030}}
                width={Math.round(2500 / maxValue * 100).toFixed(1)} 
                value={2.5}
            />
        </>
    )
}

export default WorldComparisonChart;
