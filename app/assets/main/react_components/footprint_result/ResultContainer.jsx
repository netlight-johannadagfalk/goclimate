import React, {useState} from 'react';
import SignUpContainer from './SignUpContainer.jsx';
import ResultTitle from './ResultTitle.jsx';
import CategoryChart from './CategoryChart.jsx';
import WorldComparisonChart from './WorldComparisonChart.jsx';
import MembershipSelector from './MembershipSelector.jsx';
import PaymentContainer from './PaymentContainer.jsx';
import CardInformation from './CardInformation.jsx';
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
  } from '@stripe/react-stripe-js';
import Link from '../Link.jsx';
import YourFootprintText from './YourFootprintText.jsx';
import MoneyUsageList from './MoneyUsageList.jsx';
import FAQ from './FAQ.jsx';
import LatestProjectsList from './LatestProjectsList.jsx';

/**
 * React container for Result page components
 */
    
const ResultContainer = ({ footprint, projects, countryAverage, registrationsText, commonText, modelText, lifestyleFootprintsText, lang, plan, currency, sign_up_heading_test_number }) => {
    const selectStep = false
    const [grantedReferralCode, setGrantedReferralCode] = useState(false)
    const stripePromise = loadStripe('pk_test_4QHSdRjQiwkzokPPCiK33eOq')
    const commonStrings = JSON.parse(commonText)

    return (
        <div className="relative pb-1">
            <Elements  stripe={stripePromise}  options={{locale: lang}} >
                <SignUpContainer
                    selectStep={selectStep}
                    buttonText={JSON.parse(registrationsText).continue_to_payment}
                    commonStrings={commonStrings}
                    registrationsText={JSON.parse(registrationsText)}
                    sign_up_heading_test_number={1}
                    grantedReferralCode={grantedReferralCode}
                    setGrantedReferralCode={setGrantedReferralCode}
                    signUpText={JSON.parse(registrationsText)}
                    price={JSON.parse(plan).price}
                    currency={JSON.parse(currency)}
                    months={commonStrings.months}
                >
                    {selectStep ?
                        <MembershipSelector 
                            membershipText={JSON.parse(registrationsText).membership}
                            signUpText={JSON.parse(registrationsText)}
                            setGrantedReferralCode={setGrantedReferralCode}
                            >
                        </MembershipSelector>
                    :
                        <PaymentContainer 
                            commonStrings={commonStrings} 
                        />
                    }
                </SignUpContainer>
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
                <Link    
                    link={"https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"}
                    linkText={JSON.parse(lifestyleFootprintsText).methodology} 
                />
                <MoneyUsageList 
                    moneyUsageText={JSON.parse(registrationsText).where_does_the_money_go}
                />
                <LatestProjectsList
                    latestProjectsText={JSON.parse(registrationsText).latest_projects}
                    projects={JSON.parse(projects)}
                />
                <FAQ
                    questions={JSON.parse(commonText).faq_questions}
                    faqText={JSON.parse(registrationsText).faq}
                />
            </div>
        </div>
    )
}

export default ResultContainer;
