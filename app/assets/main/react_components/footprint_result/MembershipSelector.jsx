import React from 'react';
import MembershipTypeSelector from './MembershipTypeSelector.jsx';
import ReferralCode from './ReferralCode.jsx';

const MembershipSelector = ({
  grantedReferralCode,
  setGrantedReferralCode,
  multipleOffsets,
  setMultipleOffsets,
  selectedMembership,
  setSelectedMembership,
}) => {
  return (
    <>
      <MembershipTypeSelector
        selectedMembership={selectedMembership}
        setSelectedMembership={setSelectedMembership}
        multipleOffsets={multipleOffsets}
        setMultipleOffsets={setMultipleOffsets}
      />
      <div data-inactive-class='hidden'>
        {selectedMembership !== 'free' && (
          <ReferralCode
            grantedReferralCode={grantedReferralCode}
            setGrantedReferralCode={setGrantedReferralCode}
          />
        )}
      </div>
    </>
  );
};

export default MembershipSelector;
