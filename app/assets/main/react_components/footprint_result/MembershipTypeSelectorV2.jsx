import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import Title from '../footprint_form/Title.jsx';
import MembershipAlternative from './MembershipAlternative.jsx';

const MembershipTypeSelectorV2 = ({
  selectedMembership,
  setSelectedMembership,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  result,
}) => {
  const {
    reactContentText: {
      react: {
        memberships_v2: { free, single, multi },
      },
    },
  } = useTexts();

  return (
    <>
      <Title custom_style="text-lgr" text={'Välj ditt medlemskap'} />
      <div className="lg:flex text-left">
        <MembershipAlternative
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
        <MembershipAlternative
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
        <MembershipAlternative
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

export default MembershipTypeSelectorV2;
