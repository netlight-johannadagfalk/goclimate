import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import sanitizeHtml from 'sanitize-html';
import { useSession } from '../../../../../../../contexts/SessionContext.js';
import { useTexts } from '../../../../../../../contexts/TextsContext.js';
import Preamble from '../../../common/Preamble.jsx';
import Title from '../../../common/Title.jsx';
import Payment from './components/Payment.jsx';

const RegistrationPage = ({
  selectedMembership,
  lifestyleFootprint,
  grantedReferralCode,
  multipleOffsets,
  price,
}) => {
  const {
    registrationsText: {
      sign_up_heading_collective_efficacy,
      sign_up_description,
      accept_policies,
    },
  } = useTexts();
  const { lang } = useSession();
  const stripePromise = loadStripe(window.stripe._apiKey);

  return (
    <>
      <div className="max-w-lg mx-auto">
        <div className="space-y-3">
          <Title text={sign_up_heading_collective_efficacy} />
          <Preamble text={sign_up_description} />
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

export default RegistrationPage;
