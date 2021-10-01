import React from 'react';
import MembershipAlternativeV2 from './components/membership_alternative/MembershipAlternativeV2.jsx';

const MembershipsListV2 = ({
  selectedMembership,
  setSelectedMembership,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  result
}) => {
  return (
    <>
      <div className="t:flex text-left t:pt-4">
        <MembershipAlternativeV2
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          type="free"
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          result={result}
        />
        <MembershipAlternativeV2
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          type="single"
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          result={result}
        />
        <MembershipAlternativeV2
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          type="multi"
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          result={result}
        />
      </div>
    </>
  );
};

export default MembershipsListV2;
