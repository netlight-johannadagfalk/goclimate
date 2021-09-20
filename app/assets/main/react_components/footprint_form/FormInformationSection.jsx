import React from 'react';
import LatestProjectsList from '../footprint_result/LatestProjectsList.jsx';
import MoneyUsageList from '../footprint_result/MoneyUsageList.jsx';
import PriceText from '../footprint_result/PriceText.jsx';
import ArgumentsList from './ArgumentsList.jsx';

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
      <div className="my-8">
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
