import React from 'react';
import LatestProjectsListV2 from '../../../../../common/latest_projects_list/LatestProjectsListV2.jsx';
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
      <LatestProjectsListV2 />
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
