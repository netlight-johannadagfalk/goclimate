import React from 'react';
import { useVersion } from '../context/Footprint/VersionContext.js';
import MembershipTypeSelector from './MembershipTypeSelector.jsx';
import MembershipTypeSelectorV2 from './MembershipTypeSelectorV2.jsx';
import ReferralCode from './ReferralCode.jsx';

const MembershipSelector = ({
  grantedReferralCode,
  setGrantedReferralCode,
  multipleOffsets,
  setMultipleOffsets,
  selectedMembership,
  setSelectedMembership,
  result,
}) => {
  const version = useVersion();

  return (
    <>
      {version === 'v1' ? (
        <MembershipTypeSelector
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
        />
      ) : version === 'v2' ? (
        <MembershipTypeSelectorV2
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          result={result}
        />
      ) : (
        <>{console.log('no version? ):')}</>
      )}
      <div data-inactive-class="hidden">
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
