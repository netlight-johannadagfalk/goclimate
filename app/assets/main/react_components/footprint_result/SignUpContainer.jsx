import { default as React } from 'react';
import Title from '../footprint_form/Title.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import { useTexts } from '../context/Footprint/TextsContext.js';
import MembershipSelector from './MembershipSelector.jsx';
import PriceText from './PriceText.jsx';

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
    registrationsText: { sign_up_heading_collective_efficacy },
  } = useTexts();

  return (
    <div className='max-w-lg mx-auto'>
      <div className='space-y-3'>
        <Title text={sign_up_heading_collective_efficacy} />
        <SignUpMotivationText />
        <MembershipSelector
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          setGrantedReferralCode={setGrantedReferralCode}
          grantedReferralCode={grantedReferralCode}
        />
        <PriceText
          price={price}
          grantedReferralCode={grantedReferralCode}
          selectedMembership={selectedMembership}
          multipleOffsets={multipleOffsets}
        />
      </div>
    </div>
  );
};

export default SignUpContainer;
