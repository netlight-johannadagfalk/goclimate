import React from 'react';
import { useTexts } from '../../../../../../../../../contexts/TextsContext.js';
import MembershipAlternativeV2 from './components/membership_alternative/MembershipAlternativeV2.jsx';
import Title from '../../../../../common/Title.jsx';

const MembershipsListV2 = ({
  selectedMembership,
  setSelectedMembership,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  result,
}) => {
  const {
    reactContentText: {
      memberships_v2: { free, single, multi, title },
    },
  } = useTexts();

  return (
    <>
      <Title custom_style="text-lgr" text={title} />
      <div className="lg:flex text-left">
        <MembershipAlternativeV2
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          type="free"
          title={free.title}
          sellingPoints={free.selling_points}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          result={result}
        />
        <MembershipAlternativeV2
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          type="single"
          title={single.title}
          sellingPoints={single.selling_points}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          result={result}
        />
        <MembershipAlternativeV2
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          type="multi"
          title={multi.title}
          sellingPoints={multi.selling_points}
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
