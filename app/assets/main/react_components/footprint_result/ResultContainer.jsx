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
import StaticDataProvider from '../context/Footprint/StaticDataProvider.js';

const ResultContainer = ({
  footprint,
  projects,
  countryAverage,
  registrationsText,
  commonText,
  modelText,
  lifestyleFootprintsText,
  plan,
  slug,
  currency,
  lang,
  sharedText,
}) => {
  const [selectedMembership, setSelectedMembership] = useState('single');
  const [multipleOffsets, setMultipleOffsets] = useState(2);
  const [grantedReferralCode, setGrantedReferralCode] = useState(false);

  const stripePromise = loadStripe('pk_test_4QHSdRjQiwkzokPPCiK33eOq');

  return (
    <StaticDataProvider
      registrationsText={registrationsText}
      commonText={commonText}
      modelText={modelText}
      lifestyleFootprintsText={lifestyleFootprintsText}
      currency={currency}
      slug={slug}
      lang={lang}
      projects={projects}
      sharedText={sharedText}
    >
      <div className="relative pb-1">
        <Elements stripe={stripePromise} options={{ locale: slug }}>
          <SignUpContainer
            selectedMembership={selectedMembership}
            multipleOffsets={multipleOffsets}
            grantedReferralCode={grantedReferralCode}
            price={JSON.parse(plan).price}
          >
            <Payment selectedMembership={selectedMembership} />
          </SignUpContainer>
          <SignUpContainer
            selectedMembership={selectedMembership}
            multipleOffsets={multipleOffsets}
            grantedReferralCode={grantedReferralCode}
            price={JSON.parse(plan).price}
          >
            <MembershipSelector
              selectedMembership={selectedMembership}
              setSelectedMembership={setSelectedMembership}
              multipleOffsets={multipleOffsets}
              setMultipleOffsets={setMultipleOffsets}
              setGrantedReferralCode={setGrantedReferralCode}
              grantedReferralCode={grantedReferralCode}
            ></MembershipSelector>
          </SignUpContainer>
        </Elements>
        <div className="space-y-6">
          <ResultTitle title={JSON.parse(registrationsText).well_done} />
          <YourFootprintText
            footprintValue={(JSON.parse(footprint).total.co2e / 1000).toFixed(
              1
            )}
          />
          <WorldComparisonChart
            footprint={JSON.parse(footprint)}
            countryAverage={JSON.parse(countryAverage)}
          />
          <CategoryChart footprint={JSON.parse(footprint)} />
          <Link
            link={
              'https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/'
            }
            linkText={JSON.parse(lifestyleFootprintsText).methodology}
          />
          <MoneyUsageList />
          <LatestProjectsList />
          <FAQ />
        </div>
      </div>
    </StaticDataProvider>
  );
};

export default ResultContainer;
