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
    <div className="space-y-10">
      <div className="space-y-28 t:space-y-32">
        <ArgumentsList />
        <WhereDoesTheMoneyGo />
        <LatestProjectsListV2 />
      </div>
      <PriceText
        price={price}
        grantedReferralCode={grantedReferralCode}
        selectedMembership={selectedMembership}
      />
    </div>
  );
};

export default FormInformationSection;
