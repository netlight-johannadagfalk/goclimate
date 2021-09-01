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

    return (
                <div className="max-w-lg mx-auto">
                    <div className="space-y-3">
                        <Title
                            text={signUpText.sign_up_heading_test_2}
                        />
                        <SignUpMotivationText
                            signUpMotivationText={signUpText.sign_up_description}                            
                        />
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
                    </div>
                </div>
    )
}

export default SignUpContainer;
