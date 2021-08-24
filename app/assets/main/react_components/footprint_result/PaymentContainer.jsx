import React, { useState } from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
import CardInformation from './CardInformation.jsx';
import MembershipTypeSelector from './MembershipTypeSelector.jsx';
import ReferralCode from './ReferralCode.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import SignUpTitle from './SignUpTitle.jsx';

/**
 * React container for Sign up components
 */
const PaymentContainer = ({ signUpText }) => {
    const [showPayment, setShowPayment] = useState(false)

    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <div className="callout max-w-md mx-auto">
                <CardInformation/>
                <AnswerButton 
                    label="Continue to payment" 
                    stylingClasses={"button-cta w-full"}>
                </AnswerButton>
                </div>
            </div>
        </div>

    )
}

export default PaymentContainer;
