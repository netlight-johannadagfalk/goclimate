import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

const CardInformation = ({ commonStrings }) => {

  return (
      <>
        <label className="block font-semibold mt-3">{commonStrings.email}</label>
        <input className="input w-full"/>
        <label className="block font-semibold mt-3">{commonStrings.password}</label>
        <input className="input w-full"/>
        <label className="block font-semibold mt-3">{commonStrings.credit_or_debit_card}</label>
        <CardElement className="py-3 w-full input mb-1 StripeElement StripeElement--empty"/>
        <i className="fas fa-lock" aria-hidden="true"></i>
        <span className="ml-1">Secured by Stripe</span>
      </>
  );
}
export default CardInformation;