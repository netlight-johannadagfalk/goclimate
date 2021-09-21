import { default as React } from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import { useVersion } from '../context/Footprint/VersionContext.js';
import Title from '../footprint_form/Title.jsx';
import MembershipSelector from './MembershipSelector.jsx';
import PriceText from './PriceText.jsx';
import SignUpPreamble from './SignUpPreamble.jsx';

const SignUpContainer = ({
  selectedMembership,
  setSelectedMembership,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  setGrantedReferralCode,
  price,
}) => {
  const {
    registrationsText: {
      sign_up_heading_collective_efficacy,
      sign_up_description,
    },
  } = useTexts();

  const version = useVersion();
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="space-y-3">
        <Title
          text={sign_up_heading_collective_efficacy}
          custom_style="text-lgr"
        />
        <SignUpPreamble text={sign_up_description} />
        <MembershipSelector
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          setGrantedReferralCode={setGrantedReferralCode}
          grantedReferralCode={grantedReferralCode}
        />
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

export default SignUpContainer;
