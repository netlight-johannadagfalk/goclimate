import React, { useState } from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
import MembershipTypeSelector from './MembershipTypeSelector.jsx';
import ReferralCode from './ReferralCode.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import SignUpTitle from './SignUpTitle.jsx';

/**
 * React container for Sign up components
 */
const SignUpContainer = ({ signUpText }) => {
    const [showPayment, setShowPayment] = useState(false)

    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <div className="callout max-w-md mx-auto">
                    <a id="sign-up" className="absolute -mt-32"></a>
                    <div className="space-y-3">
                        <SignUpTitle
                            signUpTitleText={signUpText.sign_up_heading_test_2}
                        />
                        <SignUpMotivationText
                            signUpMotivationText={signUpText.sign_up_description}                            
                        />
                        <input type="checkbox" id="step-one-done" className="toggler"/>
                        <div className="toggler-checked:hidden">
                            <div className="space-y-3">
                                <MembershipTypeSelector
                                    membershipText={signUpText.membership}
                                />
                                <div data-inactive-class="hidden">
                                    <ReferralCode
                                        text={signUpText}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <AnswerButton label="Continue to payment" onAnswerGiven={() => setShowPayment(!showPayment)} stylingClasses={"button-cta w-full"}></AnswerButton>
                </div>
            </div>
        </div>

    )
}

export default SignUpContainer;
