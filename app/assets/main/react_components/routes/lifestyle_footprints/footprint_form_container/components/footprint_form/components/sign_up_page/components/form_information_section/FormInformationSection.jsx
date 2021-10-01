import React from 'react';
import LatestProjectsListV2 from '../../../../../common/latest_projects_list/LatestProjectsListV2.jsx';
import WhereDoesTheMoneyGo from '../../../../../common/WhereDoesTheMoneyGo.jsx';
import PriceText from '../../../common/PriceText.jsx';
import ArgumentsList from './components/ArgumentsList.jsx';

const FormInformationSection = ({
  price,
  grantedReferralCode,
  selectedMembership
}) => {
  return (
    <>
      <ArgumentsList />
      <WhereDoesTheMoneyGo />
      <LatestProjectsListV2 />
      <PriceText
        price={price}
        grantedReferralCode={grantedReferralCode}
        selectedMembership={selectedMembership}
      />
    </>
  );
};

export default FormInformationSection;
