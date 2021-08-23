import React from 'react';
import ResultTitle from './ResultTitle.jsx';
import CategoryChart from './CategoryChart.jsx';
import WorldComparisonChart from './WorldComparisonChart.jsx';
import CardInformation from './CardInformation.jsx';
//import { Elements } from 'react-stripe-js';
import { StripeProvider } from 'react-stripe-elements';
//import { loadStripe } from '@stripe/stripe-js'

/**
 * React container for Result page components
 */
const ResultContainer = ({ footprint, countryAverage, registrationsText, commonText, lang }) => {

    //const stripePromise = loadStripe("pk_test_4QHSdRjQiwkzokPPCiK33eOq")

    return (
        <StripeProvider apiKey="pk_test_4QHSdRjQiwkzokPPCiK33eOq">
            <div className="relative pb-1">
                <CardInformation/>
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
        </StripeProvider>
    )
}

export default ResultContainer;
