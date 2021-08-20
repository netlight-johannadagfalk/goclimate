import React from 'react'
import ResultBar from './ResultBar.jsx';
import ResultText from './ResultText.jsx';

const WorldComparisonChart = ({ footprint, countryAverage, worldComparisonText, lang }) => {
    const maxValue = Math.max(footprint.total.co2e, countryAverage.co2e.co2e, 2500)

    const footprintCo2e = {
        value: footprint.total.co2e,
        inTonnes: (decimalPlaces) => {
            return (footprintCo2e.value / 1000).toFixed(decimalPlaces)
        },
        text: () => {
            return footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1) <= 1 ? 
                (worldComparisonText.one).replace('%{count}', (footprintCo2e.inTonnes(resultFootprint < 100 ? 2 : 1))) : 
                (worldComparisonText.other).replace('%{count}', (footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1)))
        }
    }
    const countryAverageCo2e = {
        value: countryAverage.co2e.co2e,
        inTonnes: (decimalPlaces) => {
            return (countryAverageCo2e / 1000).toFixed(decimalPlaces)
        }
    }

    const relativeText = footprintCo2e.value > countryAverageCo2e.value ? 
        Math.ceil((footprintCo2e.value / countryAverageCo2e.value - 1) * 100) + " % " + worldComparisonText.higher : 
        Math.ceil((1 - footprintCo2e.value / countryAverageCo2e.value) * 100) + " % " + worldComparisonText.lower
    const resultText = countryAverage.countries ? worldComparisonText.your_climate_footprint : worldComparisonText.your_climate_footprint_compared_world

    return (
        <>
            <ResultBar 
                title={{text: worldComparisonText.you + " <-"}}
                width={footprintCo2e.inTonnes(1) > 0 ? footprintCo2e.value / maxValue * 100 : 0} 
                value={footprintCo2e.inTonnes(1)}
                color={"bg-green-accent"}
                fontWeight={"font-bold"}
            />
            <ResultBar 
                title={{text: countryAverage.countries ? 
                        worldComparisonText.average_in.replace('%{region}', footprint.country.data.translations[lang])
                        : worldComparisonText.world_average}}
                width={countryAverageCo2e.inTonnes(1) > 0 ? countryAverageCo2e.value / maxValue * 100 : 0} 
                value={countryAverageCo2e.inTonnes(1)}
            />
            <ResultBar 
                title={{text: worldComparisonText.goal_2030}}
                width={2500 / maxValue * 100} 
                value={2.5}
            />
            <ResultText 
                text={resultText}
                customValues={[footprintCo2e.text, relativeText, countryAverage.countries && footprint.country.data.translations[lang]]}
            />
        </>
    )
}

export default WorldComparisonChart;
