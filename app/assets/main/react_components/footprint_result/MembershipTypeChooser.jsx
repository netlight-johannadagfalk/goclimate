import React, { useState } from 'react';
import SelectButton from './SelectButton.jsx';

/**
 * React container for Sign up components
 */
const MembershipTypeChooser = ({ membershipText }) => {
    const [selectedMembership, setSelectedMembership] = useState("single")
    
    return (
        <>
            <div className="h-px w-full bg-gray-tint-2 hidden"></div>
            <form className="space-y-3" data-target="registrations--price.peopleForm" data-url="/users/sign_up" action="/users/sign_up" acceptCharset="UTF-8" method="get">
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
            </form>
            <div className="h-px w-full bg-gray-tint-2 hidden"></div>
        </>
    )
}

export default MembershipTypeChooser;
