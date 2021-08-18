import React from 'react';
import SignUpContainer from './SignUpContainer.jsx';
import WorldComparisonChart from './WorldComparisonChart.jsx';

/**
 * React container for Result page components
 */
const ResultContainer = ({ footprint, countryAverage, registrationsText, commonText, lang }) => {

    return (
        <div className="pr-16">
            <div className="relative pb-1">
                <div className="space-y-6">
                    <SignUpContainer
                        registrationsText={JSON.parse(registrationsText)}
                    />
                    {/* <WorldComparisonChart 
                        lang={lang}
                        footprint={JSON.parse(footprint)}
                        countryAverage={JSON.parse(countryAverage)}
                        worldComparisonText={{...JSON.parse(registrationsText), ...JSON.parse(commonText)}} 
                    /> */}
                </div>
            </div>
        </div>
    )
}

export default ResultContainer;
