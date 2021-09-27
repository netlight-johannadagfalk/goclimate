import React from 'react';
import LatestProjectsList from '../../../../../common/latest_projects_list/LatestProjectsList.jsx';
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
      <ArgumentsList />
      <MoneyUsageList />
      <LatestProjectsList />
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
