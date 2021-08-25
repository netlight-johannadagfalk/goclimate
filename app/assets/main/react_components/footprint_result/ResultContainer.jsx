import React from 'react';
import SignUpContainer from './SignUpContainer.jsx';
import ResultTitle from './ResultTitle.jsx';
import CategoryChart from './CategoryChart.jsx';
import WorldComparisonChart from './WorldComparisonChart.jsx';
import CardInformation from './CardInformation.jsx';
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
  } from '@stripe/react-stripe-js';
import Link from '../Link.jsx';
import PaymentContainer from './PaymentContainer.jsx';
import YourFootprintText from './YourFootprintText.jsx';
import LatestProjectsList from './LatestProjectsList.jsx';

/**
 * React container for Result page components
 */
        
const ResultContainer = ({ footprint, projects, countryAverage, registrationsText, commonText, lifestyleFootprintsText, modelText, lang }) => {
    const commonStrings = JSON.parse(commonText)
    const stripePromise = loadStripe("pk_test_4QHSdRjQiwkzokPPCiK33eOq")

    return (
        <div className="relative pb-1">
            <Elements  stripe={stripePromise}  options={{locale: lang}} >
                <PaymentContainer commonStrings={commonStrings} registrationsStrings={JSON.parse(registrationsText)}/>
            </Elements>
            <div className="space-y-6">
                <ResultTitle
                    title={JSON.parse(registrationsText).well_done}
                />
                <YourFootprintText
                    footprintText={{heading: commonStrings.dashboard.footprint.heading, tonnes_CO2: commonStrings.tonnes_CO2}}
                    footprintValue={(JSON.parse(footprint).total.co2e / 1000).toFixed(1)}
                />
                <WorldComparisonChart 
                    lang={lang}
                    footprint={JSON.parse(footprint)}
                    countryAverage={JSON.parse(countryAverage)}
                    worldComparisonText={{...JSON.parse(registrationsText), ...commonStrings, ...JSON.parse(modelText)}} 
                />
                <CategoryChart 
                    footprint={JSON.parse(footprint)} 
                    categoryChartText={commonStrings} 
                />
                <SignUpContainer
                    signUpText={JSON.parse(registrationsText)}
                />
                <Link    
                    link={"https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"}
                    linkText={JSON.parse(lifestyleFootprintsText).methodology} 
                />
                <LatestProjectsList
                    latestProjectsText={JSON.parse(registrationsText).latest_projects}
                    projects={JSON.parse(projects)}
                />
            </div>
        </div>
    )
}

export default ResultContainer;
