import React from 'react'
import ResultBar from './ResultBar.jsx';
import ResultText from './ResultText.jsx';
import { useTexts, localeData } from '../context/Footprint/StaticDataContext.js';

/**
 * Chart for comparison to the world using resultbars of different lengths, calculated in scale to each other
 */
const WorldComparisonChart = ({ footprint, countryAverage }) => {
    const maxValue = Math.max(footprint.total.co2e, countryAverage.co2e.co2e, 2500)

    const footprintCo2e = {
        value: footprint.total.co2e,
        inTonnes: (decimalPlaces) => {
            return (footprintCo2e.value / 1000).toFixed(decimalPlaces)
        },
        text: () => {
            return footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1) <= 1 ? 
                (useTexts().modelText.one).replace('%{count}', (footprintCo2e.inTonnes(resultFootprint < 100 ? 2 : 1))) : 
                (useTexts().modelText.other).replace('%{count}', (footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1)))
        }
    }
    const countryAverageCo2e = {
        value: countryAverage.co2e.co2e,
        inTonnes: (decimalPlaces) => {
            return (countryAverageCo2e.value / 1000).toFixed(decimalPlaces)
        }
    }

    const relativeText = footprintCo2e.value > countryAverageCo2e.value ? 
        Math.ceil((footprintCo2e.value / countryAverageCo2e.value - 1) * 100) + " % " + useTexts().registrationsText.higher : 
        Math.ceil((1 - footprintCo2e.value / countryAverageCo2e.value) * 100) + " % " + useTexts().registrationsText.lower
    const resultText = countryAverage.countries ? useTexts().registrationsText.your_climate_footprint : useTexts().registrationsText.your_climate_footprint_compared_world

    return (
        <>
            <div className="relative pb-1">
                <div className="space-y-6">
                    <ResultBar 
                        title={{text: useTexts().registrationsText.you + " <-"}}
                        width={footprintCo2e.inTonnes(1) > 0 ? footprintCo2e.value / maxValue * 100 : 0} 
                        value={footprintCo2e.inTonnes(1)}
                        color={"bg-green-accent"}
                        fontWeight={"font-bold"}
                    />
                    <ResultBar 
                        title={{text: countryAverage.countries ? 
                                useTexts().registrationsText.average_in.replace('%{region}', footprint.country.data.translations[localeData().lang])
                                : useTexts().registrationsText.world_average}}
                        width={countryAverageCo2e.inTonnes(1) > 0 ? countryAverageCo2e.value / maxValue * 100 : 0} 
                        value={countryAverageCo2e.inTonnes(1)}
                    />
                    <ResultBar 
                        title={{text: useTexts().registrationsText.goal_2030}}
                        width={2500 / maxValue * 100} 
                        value={2.5}
                    />
                </div>
            </div>
            <ResultText 
                text={resultText}
                customValues={[footprintCo2e.text, relativeText, countryAverage.countries && footprint.country.data.translations[localeData().lang]]}
            />
        </>
    )
}

export default WorldComparisonChart;
