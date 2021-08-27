import React, { useState } from 'react';
import SelectButton from './SelectButton.jsx';

/**
 * React container for Sign up components
 */
const MembershipTypeSelector = ({ membershipText, selectedMembership, setSelectedMembership, currentMultipleValue, setCurrentMultipleValue}) => {
    
    return (
        <div className="space-y-3">
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="free"  text={membershipText.free}
                currentMultipleValue={currentMultipleValue} setCurrentMultipleValue={setCurrentMultipleValue}
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="single" text={membershipText.single}
                currentMultipleValue={currentMultipleValue} setCurrentMultipleValue={setCurrentMultipleValue}
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="multi" text={membershipText.multi}
                currentMultipleValue={currentMultipleValue} setCurrentMultipleValue={setCurrentMultipleValue}
            />
        </div>
    )
}

export default MembershipTypeSelector;
