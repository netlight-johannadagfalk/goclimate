import React from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';

/**
 * React container for the payment button
 */
const PaymentButton = ({text, onAnswerGiven}) => {
    return (
        <div>
            <AnswerButton
                label={text}
                stylingClasses = {"button-cta" + " w-full"}
                onAnswerGiven = {onAnswerGiven}
            />
        </div>
    )
}

export default PaymentButton;
