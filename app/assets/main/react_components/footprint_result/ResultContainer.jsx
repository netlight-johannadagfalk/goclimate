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

/**
 * React container for Result page components
 */
        
const ResultContainer = ({ footprint, countryAverage, registrationsText, activerecordText, commonText, lifestyleFootprintsText, lang }) => {
    
    const stripePromise = loadStripe("pk_test_4QHSdRjQiwkzokPPCiK33eOq")
    console.log(activerecordText)

    return (
        <div className="relative pb-1">
             <Elements stripe={stripePromise}>
                <PaymentContainer/>
            </Elements>
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
                    signUpText={JSON.parse(registrationsText)}
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
