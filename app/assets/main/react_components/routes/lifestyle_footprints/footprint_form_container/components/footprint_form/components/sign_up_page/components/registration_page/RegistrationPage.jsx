import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import sanitizeHtml from 'sanitize-html';
import { useSession } from '../../../../../../../contexts/SessionContext.js';
import { useTexts } from '../../../../../../../contexts/TextsContext.js';
import Title from '../../../common/Title.jsx';
import Payment from './components/Payment.jsx';
import Preamble from '../../../common/Preamble.jsx';

const RegistrationPage = ({
  selectedMembership,
  lifestyleFootprint,
  grantedReferralCode,
  multipleOffsets,
  price,
}) => {
  const {
    registrationsText: { sign_up_heading_collective_efficacy, accept_policies },
    reactContentText: {
      sign_up_page: {
        registration_page: { preamble },
      },
    },
  } = useTexts();
  const { lang } = useSession();
  const stripePromise = loadStripe(window.stripe._apiKey);

  return (
    <>
      <Title
        customStyle="text-lgr"
        text={sign_up_heading_collective_efficacy}
      />
      <div className="max-w-lg mx-auto">
        <div className="space-y-3">
          <Preamble text={preamble} />
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
