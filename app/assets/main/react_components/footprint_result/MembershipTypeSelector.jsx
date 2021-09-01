import React from 'react';
import SelectButton from './SelectButton.jsx';

/**
 * React container for Sign up components
 */
const MembershipTypeSelector = ({ membershipText, selectedMembership, setSelectedMembership, multipleOffsets, setMultipleOffsets}) => {
    
    return (
        <div className="space-y-3 text-left">
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="free" text={membershipText.free}
                multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="single" text={membershipText.single}
                multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="multi" text={membershipText.multi}
                multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
            />
        </div>
    )
}

export default MembershipTypeSelector;
