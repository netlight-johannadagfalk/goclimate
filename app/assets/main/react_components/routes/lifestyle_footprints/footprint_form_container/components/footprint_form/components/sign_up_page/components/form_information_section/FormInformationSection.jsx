import React from 'react';
import LatestProjectsList from '../../../../../common/LatestProjectsList.jsx';
import MoneyUsageList from '../../../../../common/MoneyUsageList.jsx';
import PriceText from '../../../common/PriceText.jsx';
import ArgumentsList from './components/ArgumentsList.jsx';

const FormInformationSection = ({
  price,
  grantedReferralCode,
  selectedMembership,
  multipleOffsets,
}) => {
  return (
    <>
      <div className="callout my-8">
        <ArgumentsList />
      </div>
      <div className="callout my-8">
        <MoneyUsageList />
      </div>
      <div className="callout my-8">
        <LatestProjectsList />
      </div>
      <PriceText
        price={price}
        grantedReferralCode={grantedReferralCode}
        selectedMembership={selectedMembership}
        multipleOffsets={multipleOffsets}
      />
    </>
  );
};

export default FormInformationSection;
