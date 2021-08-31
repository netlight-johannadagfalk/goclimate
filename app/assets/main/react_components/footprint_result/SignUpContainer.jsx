import React, { useState } from 'react';
import MembershipTypeSelector from './MembershipTypeSelector.jsx';
import ReferralCode from './ReferralCode.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import Title from '../footprint_form/Title.jsx';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
import PriceText from './PriceText.jsx';

/**
 * React container for Sign up components
 */
const SignUpContainer = ({ signUpText, price, currency, months }) => {
    const [selectedMembership, setSelectedMembership] = useState("single")
    const [grantedReferralCode, setGrantedReferralCode] = useState(false)
    const [multipleOffsets, setMultipleOffsets] = useState(2);

    function onContinueToPayment(givenAnswer){
        // What happens when clicking continue to payment button
    }

    return (
                <div className="max-w-lg mx-auto">
                    <a id="sign-up" className="absolute -mt-32"></a>
                    <div className="space-y-3">
                        <Title
                            text={signUpText.sign_up_heading_test_2}
                        />
                        <SignUpMotivationText
                            signUpMotivationText={signUpText.sign_up_description}                            
                        />
                        <input type="checkbox" id="step-one-done" className="toggler"/>
                        <div className="toggler-checked:hidden">
                            <div className="space-y-3">
                                <MembershipTypeSelector
                                    membershipText={signUpText.membership}
                                    selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership}
                                    multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
                                />
                                <div data-inactive-class="hidden">
                                    <ReferralCode
                                        text={signUpText}
                                        setGrantedReferralCode={setGrantedReferralCode}
                                    />
                                </div>
                            </div>
                        </div>
                        <PriceText
                            priceObject={price}
                            currency={currency}
                            months={months}
                            signUpText={signUpText}
                            grantedReferralCode={grantedReferralCode}
                            selectedMembership={selectedMembership}
                            multipleOffsets={multipleOffsets}
                        />
                        {/*<AnswerButton
                            label={signUpText.continue_to_payment}
                            stylingClasses = {"button-cta" + " w-full"}
                            onAnswerGiven = {onContinueToPayment}
                        />*/}
                    </div>
                </div>
    )
}

export default SignUpContainer;
