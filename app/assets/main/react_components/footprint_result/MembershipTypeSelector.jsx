import React from 'react';
import SelectButton from './SelectButton.jsx';
import { useTexts } from '../context/Footprint/StaticDataContext.js';

/**
 * React container for Sign up components
 */
const MembershipTypeSelector = ({ selectedMembership, setSelectedMembership, multipleOffsets, setMultipleOffsets}) => {
    return (
        <div className="space-y-3 text-left">
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="free" text={useTexts().registrationsText.membership.free}
                multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="single" text={useTexts().registrationsText.membership.single}
                multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="multi" text={useTexts().registrationsText.membership.multi}
                multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
            />
        </div>
    )
}

export default MembershipTypeSelector;
