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
                    <div>7 dahllas/month</div>
                    <div>Where does the money go</div>
                    <AnswerButton 
                        label="Continue to payment" 
                        stylingClasses={"button-cta w-full mt-3"}>
                    </AnswerButton>
                    <div>Terms of use and plicies</div>
                </div>
            </div>
        </div>

    )
}

export default PaymentContainer;
