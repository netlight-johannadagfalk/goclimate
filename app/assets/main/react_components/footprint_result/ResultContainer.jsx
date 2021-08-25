import React from 'react';
import SignUpContainer from './SignUpContainer.jsx';
import ResultTitle from './ResultTitle.jsx';
import CategoryChart from './CategoryChart.jsx';
import WorldComparisonChart from './WorldComparisonChart.jsx';
import YourFootprintText from './YourFootprintText.jsx';
import Link from '../Link.jsx';

/**
 * React container for Result page components
 */
const ResultContainer = ({ footprint, countryAverage, registrationsText, commonText, modelText, lifestyleFootprintsText, lang, plan, currency, months }) => {
    
    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <ResultTitle
                    title={JSON.parse(registrationsText).well_done}
                />
                <YourFootprintText
                    footprintText={{heading: JSON.parse(commonText).dashboard.footprint.heading, tonnes_CO2: JSON.parse(commonText).tonnes_CO2}}
                    footprintValue={(JSON.parse(footprint).total.co2e / 1000).toFixed(1)}
                />
                <WorldComparisonChart 
                    lang={lang}
                    footprint={JSON.parse(footprint)}
                    countryAverage={JSON.parse(countryAverage)}
                    worldComparisonText={{...JSON.parse(registrationsText), ...JSON.parse(commonText), ...JSON.parse(modelText)}} 
                />
                <CategoryChart 
                    footprint={JSON.parse(footprint)} 
                    categoryChartText={JSON.parse(commonText)} 
                />
                <SignUpContainer
                    signUpText={JSON.parse(registrationsText)}
                    price={JSON.parse(plan).price}
                    currency={JSON.parse(currency)}
                    months={JSON.parse(months)}
                />
                <Link    
                    link={"https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"}
                    linkText={JSON.parse(lifestyleFootprintsText).methodology} 
                />
            </div>
        </div>
    )
}

export default ResultContainer;
