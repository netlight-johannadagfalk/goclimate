import React from 'react';
import SignUpContainer from './SignUpContainer.jsx';
import ResultTitle from './ResultTitle.jsx';
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
                    <ResultTitle
                        title={JSON.parse(registrationsText).well_done}
                    />
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
                    <SignUpContainer
                        registrationsText={JSON.parse(registrationsText)}
                    />
                </div>
            </div>
        </div>
    )
}

export default ResultContainer;
