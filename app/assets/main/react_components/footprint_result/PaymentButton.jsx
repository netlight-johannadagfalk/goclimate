import React from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';

/**
 * React container for the payment button
 */
const PaymentButton = ({text}) => {
    return (
        <div>
            <AnswerButton
                label={text}
                stylingClasses = {"button-cta" + " w-full"}
            />
        </div>
    )
}

export default PaymentButton;
