import React from 'react';
import CategoryChart from './CategoryChart.jsx';
import WorldComparisonChart from './WorldComparisonChart.jsx';

/**
 * React container for Result page components
 */
const ResultContainer = ({ footprint, countryAverage, registrationsText, commonText, lang }) => {
    return (
        <div className="pr-16">
            <div className="relative pb-1">
                <div className="space-y-6">
                    <WorldComparisonChart 
                        lang={lang}
                        footprint={JSON.parse(footprint)}
                        countryAverage={JSON.parse(countryAverage)}
                        worldComparisonText={{...JSON.parse(registrationsText), ...JSON.parse(commonText)}} 
                    />
                    <CategoryChart 
                        footprint={JSON.parse(footprint)} 
                        categoryChartText={JSON.parse(commonText)} 
                    />
                </div>
            </div>
        </div>
    )
}

export default ResultContainer;
