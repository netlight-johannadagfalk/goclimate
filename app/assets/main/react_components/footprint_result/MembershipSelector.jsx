import React from 'react';
import MembershipTypeSelector from './MembershipTypeSelector.jsx';
import ReferralCode from './ReferralCode.jsx';

/**
 * React container for Sign up components
 */
const MembershipSelector = ({ signUpText, setGrantedReferralCode, multipleOffsets, setMultipleOffsets, selectedMembership, setSelectedMembership }) => {

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
