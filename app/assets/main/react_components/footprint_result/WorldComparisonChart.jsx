import React from 'react'
import ResultBar from './ResultBar.jsx';

const WorldComparisonChart = ({ footprint, countryAverage, worldComparisonText, lang }) => {
    const maxValue = Math.max(footprint.total.co2e, countryAverage.co2e.co2e, 2500)
    const footprintCo2e = footprint.total.co2e;
    const countryAverageCo2e = countryAverage.co2e.co2e; 
    return (
        <>
            <ResultBar 
                title={{text: worldComparisonText.you + " <-"}}
                width={(footprintCo2e / 1000).toFixed(1) > 0 ? footprintCo2e / maxValue * 100 : 0} 
                value={(footprintCo2e / 1000).toFixed(1)}
                color={"bg-green-accent"}
                fontWeight={"font-bold"}
            />
            <ResultBar 
                title={{text: countryAverage.countries ? 
                        worldComparisonText.average_in.replace('%{region}', footprint.country.data.translations[lang])
                        : worldComparisonText.world_average}}
                width={(countryAverageCo2e / 1000).toFixed(1) > 0 ? countryAverageCo2e / maxValue * 100 : 0} 
                value={(countryAverageCo2e / 1000).toFixed(1)}
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
