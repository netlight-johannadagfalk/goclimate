import React from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const CardInformation = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
  }
    /*if (elements == null) {
      return;
    }
  }

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    console.log("error: " + error)
    console.log("paymentMethod: " + paymentMethod)*/

    //class="input mb-3 m-lg:mb-0 m-lg:mr-3 flex m-lg:w-1/3"
  return (
      <>
        <label className="block font-semibold mt-3">Email</label>
        <input className="input w-full"/>
        <label className="block font-semibold mt-3">Password</label>
        <input className="input w-full"/>
        <label className="block font-semibold mt-3">Credit or debit card</label>
        <CardElement className="pb-4 w-full input mb-1 StripeElement StripeElement--empty"/>
        <i className="fas fa-lock" aria-hidden="true"></i>
        <span className="ml-1">Secured by Stripe</span>
      </>
  );
}
export default CardInformation;