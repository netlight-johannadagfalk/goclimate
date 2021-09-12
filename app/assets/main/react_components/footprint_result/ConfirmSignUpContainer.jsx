import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './Payment.jsx';
import Title from '../footprint_form/Title.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import { useTexts } from '../context/Footprint/TextsContext.js';
import { useLocaleData } from '../context/Footprint/LocaleContext.js';
import sanitizeHtml from 'sanitize-html';

const ConfirmSignUpContainer = ({
  selectedMembership,
  lifestyleFootprint,
  grantedReferralCode,
  multipleOffsets,
  price,
}) => {
  const {
    registrationsText: { sign_up_heading_collective_efficacy, accept_policies },
  } = useTexts();
  const { lang } = useLocaleData();

  const stripePromise = loadStripe(window.stripe._apiKey);

  return (
    <>
      <div className='max-w-lg mx-auto'>
        <div className='space-y-3'>
          <Title text={sign_up_heading_collective_efficacy} />
          <SignUpMotivationText />
          <Elements stripe={stripePromise} options={{ locale: lang }}>
            <Payment
              selectedMembership={selectedMembership}
              lifestyleFootprint={lifestyleFootprint}
              grantedReferralCode={grantedReferralCode}
              multipleOffsets={multipleOffsets}
              price={price}
            />
          </Elements>
        </div>
      </div>
      <div
        className={'inject-link pt-4'}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(accept_policies),
        }}
      ></div>
    </>
  );
};

export default ConfirmSignUpContainer;
