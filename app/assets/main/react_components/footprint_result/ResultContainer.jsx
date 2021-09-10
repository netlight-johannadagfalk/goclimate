import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import Link from '../Link.jsx';
import CategoryChart from './CategoryChart.jsx';
import FAQ from './FAQ.jsx';
import LatestProjectsList from './LatestProjectsList.jsx';
import MembershipSelector from './MembershipSelector.jsx';
import MoneyUsageList from './MoneyUsageList.jsx';
import Payment from './Payment.jsx';
import ResultTitle from './ResultTitle.jsx';
import SignUpContainer from './SignUpContainer.jsx';
import WorldComparisonChart from './WorldComparisonChart.jsx';
import YourFootprintText from './YourFootprintText.jsx';

/**
 * React container for Result page components
 */

const ResultContainer = ({
  footprint,
  projects,
  countryAverage,
  registrationsText,
  commonText,
  modelText,
  lifestyleFootprintsText,
  lang,
  plan,
  currency,
}) => {
  const [selectedMembership, setSelectedMembership] = useState('single');
  const [multipleOffsets, setMultipleOffsets] = useState(2);
  const [grantedReferralCode, setGrantedReferralCode] = useState(false);
  const stripePromise = loadStripe('pk_test_4QHSdRjQiwkzokPPCiK33eOq');
  const commonStrings = JSON.parse(commonText);

  return (
    <div className='relative pb-1'>
      <Elements stripe={stripePromise} options={{ locale: lang }}>
        <SignUpContainer
          selectedMembership={selectedMembership}
          multipleOffsets={multipleOffsets}
          isPayment={true}
          commonStrings={commonStrings}
          signUpText={JSON.parse(registrationsText)}
          grantedReferralCode={grantedReferralCode}
          price={JSON.parse(plan).price}
          currency={JSON.parse(currency)}
        >
          <Payment commonStrings={commonStrings} />
        </SignUpContainer>
        <SignUpContainer
          selectedMembership={selectedMembership}
          multipleOffsets={multipleOffsets}
          isPayment={false}
          commonStrings={commonStrings}
          registrationsText={JSON.parse(registrationsText)}
          grantedReferralCode={grantedReferralCode}
          price={JSON.parse(plan).price}
          currency={JSON.parse(currency)}
        >
          <MembershipSelector
            selectedMembership={selectedMembership}
            setSelectedMembership={setSelectedMembership}
            multipleOffsets={multipleOffsets}
            setMultipleOffsets={setMultipleOffsets}
            signUpText={JSON.parse(registrationsText)}
            setGrantedReferralCode={setGrantedReferralCode}
            grantedReferralCode={grantedReferralCode}
          ></MembershipSelector>
        </SignUpContainer>
      </Elements>
      <div className='space-y-6'>
        <ResultTitle title={JSON.parse(registrationsText).well_done} />
        <YourFootprintText
          footprintText={{
            heading: commonStrings.dashboard.footprint.heading,
            tonnes_CO2: commonStrings.tonnes_CO2,
          }}
          footprintValue={(JSON.parse(footprint).total.co2e / 1000).toFixed(1)}
        />
        <WorldComparisonChart
          lang={lang}
          footprint={JSON.parse(footprint)}
          countryAverage={JSON.parse(countryAverage)}
          worldComparisonText={{
            ...JSON.parse(registrationsText),
            ...commonStrings,
            ...JSON.parse(modelText),
          }}
        />
        <CategoryChart
          footprint={JSON.parse(footprint)}
          categoryChartText={commonStrings}
        />
        <Link
          link={
            'https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/'
          }
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
          questions={commonStrings.faq_questions}
          faqText={JSON.parse(registrationsText).faq}
        />
      </div>
    </div>
  );
};

export default ResultContainer;
