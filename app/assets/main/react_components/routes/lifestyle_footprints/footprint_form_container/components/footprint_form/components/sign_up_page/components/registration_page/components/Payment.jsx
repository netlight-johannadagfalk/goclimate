import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from '../../../../../../../../contexts/SessionContext.js';
import { useTexts } from '../../../../../../../../contexts/TextsContext.js';
import PriceText from '../../../../common/PriceText.jsx';

const Payment = ({
  selectedMembership,
  lifestyleFootprint,
  grantedReferralCode,
  multipleOffsets,
  price,
}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cardErrorMessage, setCardErrorMessage] = useState('');
  const [loadingIconState, setLoadingIconState] = useState('hidden');
  const mounted = useRef(false);
  const Elements = useElements();
  const stripe = useStripe();
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  const {
    commonText: { email, password, credit_or_debit_card },
    registrationsText: { start_subscription },
  } = useTexts();
  const { currentRegion, slug } = useSession();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const signUp = (paymentMethodID = undefined) => {
    return fetch(slug + '/users.json', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lifestyle_footprint: lifestyleFootprint,
        people: selectedMembership === 'multi' ? multipleOffsets : 1,
        referral_code: grantedReferralCode,
        membership: selectedMembership,
        user: {
          region: currentRegion,
          email: userEmail,
          password: userPassword,
        },
        payment_method_id: paymentMethodID,
      }),
    })
      .then((response) => {
        if (mounted.current) {
          response.json().then((response) => {
            switch (response.next_step) {
              case 'redirect':
                window.location = response.success_url;
                break;
              case 'confirmation_required':
                confirm(
                  response.intent_type,
                  response.intent_client_secret
                ).then((result) => {
                  if (result.error !== undefined) {
                    setErrorMessage(result.error.message);
                  } else {
                    window.location = response.success_url;
                  }
                });
                break;
              default:
                setErrorMessage(response.error.message);
                break;
            }
          });
        }
      })
      .catch((error) => {
        if (error.cardError) {
          setErrorMessage(error.message);
          return;
        }
        window.Sentry.captureException(error); // These errors are unexpected, so report them.
        console.log('Something went wrong, trying again.', error);
      })
      .finally(() => {
        setLoadingIconState('hidden');
      });
  };

  const confirm = (intentType, intentClientSecret) => {
    switch (intentType) {
      case 'payment_intent':
        return stripe.confirmCardPayment(intentClientSecret);
      case 'setup_intent':
        return stripe.confirmCardSetup(intentClientSecret);
      default:
        return null;
    }
  };

  const submitPayment = async (event) => {
    event.preventDefault();

    setLoadingIconState('');

    if (selectedMembership !== 'free') {
      if (!stripe || !Elements) {
        setErrorMessage(
          'An unexpected error occurred. Please start over and try again. If the issue remains, please contact us at hello@goclimate.com.'
        );
        setLoadingIconState('hidden');
        return;
      }
      const cardElement = Elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      if (error) {
        setErrorMessage(error.message);
        setLoadingIconState('hidden');
        return;
      } else {
        signUp(paymentMethod.id);
      }
    } else {
      signUp();
    }
  };

  return (
    <>
      {Elements && stripe && (
        <form className="text-left px-2" onSubmit={submitPayment}>
          <label className="block font-semibold mt-3">{email}</label>
          <input
            required
            placeholder={email}
            onChange={(e) => setUserEmail(e.target.value)}
            type="email"
            className="input w-full"
            autoComplete="on"
          />
          <label className="block font-semibold mt-3">{password}</label>
          <input
            placeholder={password}
            onChange={(e) => setUserPassword(e.target.value)}
            className="input w-full"
            minLength={6}
            maxLength={128}
            autoComplete="new-password"
            type="password"
          />
          {selectedMembership !== 'free' && (
            <>
              <label className="block font-semibold mt-3">
                {credit_or_debit_card}
              </label>
              <CardElement
                onChange={(e) => {
                  setCardErrorMessage(e.error ? e.error.message : '');
                }}
                options={{ hidePostalCode: true }}
                className="py-3 w-full input mb-1 StripeElement StripeElement--empty"
              />
              <div className="text-orange-shade-1 text-left">
                {cardErrorMessage}
              </div>
              <i className="fas fa-lock" aria-hidden="true"></i>
              <span className="ml-1">Secured by Stripe</span>
            </>
          )}
          <PriceText
            price={price}
            grantedReferralCode={grantedReferralCode}
            selectedMembership={selectedMembership}
          />
          <p className="text-orange-shade-1 pb-3 text-left">{errorMessage}</p>
          <button
            disabled={loadingIconState === ''}
            className={'button button-cta w-full'}
            type="submit"
            onClick={() => setErrorMessage('')}
          >
            <i className={'fas fa-spinner fa-spin ' + loadingIconState}></i>
            <span> {start_subscription}</span>
          </button>
        </form>
      )}
    </>
  );
};

export default Payment;
