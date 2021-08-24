import React from 'react';
import ResultTitle from './ResultTitle.jsx';
import CategoryChart from './CategoryChart.jsx';
import WorldComparisonChart from './WorldComparisonChart.jsx';
import CardInformation from './CardInformation.jsx';
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
  } from '@stripe/react-stripe-js';

/**
 * React container for Result page components
 */
const ResultContainer = ({ footprint, countryAverage, registrationsText, commonText, lang }) => {

    const stripePromise = loadStripe("pk_test_4QHSdRjQiwkzokPPCiK33eOq")

    return (
            <div className="relative pb-1">
                <Elements stripe={stripePromise}>
                    <CardInformation/>
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
                </div>
            </div>
    )
}

export default ResultContainer;
