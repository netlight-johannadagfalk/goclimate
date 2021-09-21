import { default as React } from 'react';
import { useTexts } from '../../../../../../../contexts/TextsContext.js';
import { useVersion } from '../../../../../../../contexts/VersionContext.js';
import Title from '../../../common/Title.jsx';
import PriceText from '../../../common/PriceText.jsx';
import Preamble from '../../../common/Preamble.jsx';
import ReferralCode from './components/ReferralCode.jsx';
import MembershipsList from './components/memberships_list/MembershipsList.jsx';
import MembershipsListV2 from './components/memberships_list/MembershipsListV2.jsx';

const MembershipPage = ({
  selectedMembership,
  setSelectedMembership,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  setGrantedReferralCode,
  price,
  result,
}) => {
  const {
    registrationsText: {
      sign_up_heading_collective_efficacy,
      sign_up_description,
    },
  } = useTexts();

  const version = useVersion();

  return (
    <div className={version === 'v1' ? 'max-w-lg mx-auto' : ''}>
      <div className="space-y-3">
        <Title
          text={sign_up_heading_collective_efficacy}
          custom_style="text-lgr"
        />
        <Preamble text={sign_up_description} />
        {version === 'v1' ? (
          <MembershipsList
            selectedMembership={selectedMembership}
            setSelectedMembership={setSelectedMembership}
            multipleOffsets={multipleOffsets}
            setMultipleOffsets={setMultipleOffsets}
          />
        ) : (
          <MembershipsListV2
            selectedMembership={selectedMembership}
            setSelectedMembership={setSelectedMembership}
            multipleOffsets={multipleOffsets}
            setMultipleOffsets={setMultipleOffsets}
            grantedReferralCode={grantedReferralCode}
            result={result}
          />
        )}
        <div data-inactive-class="hidden">
          {selectedMembership !== 'free' && (
            <ReferralCode
              grantedReferralCode={grantedReferralCode}
              setGrantedReferralCode={setGrantedReferralCode}
            />
          )}
        </div>
        {version === 'v1' && (
          <PriceText
            price={price}
            grantedReferralCode={grantedReferralCode}
            selectedMembership={selectedMembership}
            multipleOffsets={multipleOffsets}
          />
        )}
      </div>
    </div>
  );
};

export default MembershipPage;
