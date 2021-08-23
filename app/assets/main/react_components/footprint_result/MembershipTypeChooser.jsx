import React, { useState } from 'react';
import SelectButton from './SelectButton.jsx';

/**
 * React container for Sign up components
 */
const MembershipTypeChooser = ({ membershipText }) => {
    const [selectedMembership, setSelectedMembership] = useState("single")
    
    return (
        <div className="space-y-3">
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="free"  text={membershipText.free} 
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="single" text={membershipText.single}
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="multi" text={membershipText.multi}
            />
        </div>
    )
}

export default MembershipTypeChooser;
