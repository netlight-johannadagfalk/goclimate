import { default as React } from 'react';
import { useTexts } from '../../../../../../../contexts/TextsContext.js';
import { useVersion } from '../../../../../../../contexts/VersionContext.js';
import Preamble from '../../../common/Preamble.jsx';
import PriceText from '../../../common/PriceText.jsx';
import Title from '../../../common/Title.jsx';
import MembershipsList from './components/memberships_list/MembershipsList.jsx';
import MembershipsListV2 from './components/memberships_list/MembershipsListV2.jsx';
import ReferralCode from './components/ReferralCode.jsx';

const MembershipPage = ({
  selectedMembership,
  setSelectedMembership,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  setGrantedReferralCode,
  price,
  result
}) => {
  const {
    registrationsText: {
      sign_up_heading_collective_efficacy,
      sign_up_description
    },
    reactContentText: {
      sign_up_page: {
        membership_page: { preamble_part_1, preamble_part_2 }
      }
    }
  } = useTexts();

  const version = useVersion();

  return (
    <div
      className={'space-y-4 ' + (version === 'v1' ? 'max-w-lg mx-auto' : '')}
    >
      <div className="space-y-3">
        <Title
          text={sign_up_heading_collective_efficacy}
          customStyle="text-lgr px-4"
        />
        {version === 'v1' ? (
          <>
            <Preamble text={sign_up_description} />
            <MembershipsList
              selectedMembership={selectedMembership}
              setSelectedMembership={setSelectedMembership}
              multipleOffsets={multipleOffsets}
              setMultipleOffsets={setMultipleOffsets}
            />
          </>
        ) : (
          <div className="t:space-y-8">
            <div className="space-y-3">
              <Preamble text={preamble_part_1} />
              <Preamble text={preamble_part_2} />
            </div>
            <MembershipsListV2
              selectedMembership={selectedMembership}
              setSelectedMembership={setSelectedMembership}
              multipleOffsets={multipleOffsets}
              setMultipleOffsets={setMultipleOffsets}
              grantedReferralCode={grantedReferralCode}
              result={result}
            />
          </div>
        )}
      </div>
      <div className="space-y-6">
        {selectedMembership !== 'free' && (
          <ReferralCode
            grantedReferralCode={grantedReferralCode}
            setGrantedReferralCode={setGrantedReferralCode}
          />
        )}
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
