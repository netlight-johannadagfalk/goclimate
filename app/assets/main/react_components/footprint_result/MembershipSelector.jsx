import React, { useState } from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
import MembershipTypeSelector from './MembershipTypeSelector.jsx';
import ReferralCode from './ReferralCode.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import SignUpTitle from './SignUpTitle.jsx';
import PriceText from './PriceText.jsx';

/**
 * React container for Sign up components
 */
const MembershipSelector = ({ signUpText, grantedReferralCode, setGrantedReferralCode, setSelectStep, multipleOffsets, setMultipleOffsets, selectedMembership, setSelectedMembership }) => {
    
    function onContinueToPayment(givenAnswer){
        setSelectStep(false)
        console.log("false")
        // What happens when clicking continue to payment button
    }

    return (
        <>
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
        </>
    )
}

export default MembershipSelector;
