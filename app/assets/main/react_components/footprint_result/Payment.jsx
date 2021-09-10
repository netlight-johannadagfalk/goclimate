import { CardElement } from '@stripe/react-stripe-js';
import React from 'react';

/**
 * Logic-less component for inputing payment details
 * TODO: add stripe logic, including collection of email and password
 */
const Payment = ({ commonStrings, selectedMembership }) => {
  return (
    <div className='text-left'>
      <label className='block font-semibold mt-3'>{commonStrings.email}</label>
      <input className='input w-full' />
      <label className='block font-semibold mt-3'>
        {commonStrings.password}
      </label>
      <input className='input w-full' />
      {selectedMembership !== 'free' && (
        <>
          <label className='block font-semibold mt-3'>
            {commonStrings.credit_or_debit_card}
          </label>
          <CardElement className='py-3 w-full input mb-1 StripeElement StripeElement--empty' />
          <i className='fas fa-lock' aria-hidden='true'></i>
          <span className='ml-1'>Secured by Stripe</span>
        </>
      )}
    </div>
  );
};

export default Payment;
