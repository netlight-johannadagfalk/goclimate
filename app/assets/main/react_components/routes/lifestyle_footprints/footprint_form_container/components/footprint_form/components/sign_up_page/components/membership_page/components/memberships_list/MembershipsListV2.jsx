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
      sign_up_page: {
        membership_page: {
          memberships_v2: {
            desktop: { title },
          },
        },
      },
    },
  } = useTexts();

  return (
    <>
      <Title custom_style="text-lgr" text={title} />
      <div className="t:flex text-left">
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
