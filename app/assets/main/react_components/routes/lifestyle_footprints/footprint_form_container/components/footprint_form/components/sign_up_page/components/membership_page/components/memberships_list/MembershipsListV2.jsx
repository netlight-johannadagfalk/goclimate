import React from 'react';
import { useTexts } from '../../../../../../../../../contexts/TextsContext.js';
import Title from '../../../../../common/Title.jsx';
import MembershipAlternativeV2 from './components/membership_alternative/MembershipAlternativeV2.jsx';

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
      memberships_v2: {
        mobile,
        desktop: { free, single, multi, title },
      },
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
          mobile={mobile.free}
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
          mobile={mobile.single}
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
          mobile={mobile.multi}
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
