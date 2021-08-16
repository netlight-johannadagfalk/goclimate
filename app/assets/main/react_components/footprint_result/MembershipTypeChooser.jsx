import React, { useState } from 'react';
import SelectButton from './SelectButton.jsx';

/**
 * React container for Sign up components
 */
const MembershipTypeChooser = () => {
    const [selectedMembership, setSelectedMembership] = useState("single")

    return (
        <form className="space-y-3" data-target="registrations--price.peopleForm" data-url="/users/sign_up" action="/users/sign_up" accept-charset="UTF-8" method="get">
            <input value="b3ec26a402c164dd2f8a78bf7e95841922cbb9bc" type="hidden" name="lifestyle_footprint" id="lifestyle_footprint"/>
            <SelectButton selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} buttonType="free" boldDisplayedText="Free account." unBoldDisplayedText="Track your carbon footprint over time." />
            <SelectButton selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} buttonType="single" boldDisplayedText="Offset" unBoldDisplayedText=" your carbon footprint through climate projects."/>
            <SelectButton selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} buttonType="multi" boldDisplayedText="Offset multiple times." unBoldDisplayedText="Offset more for yourself or for loved ones."/>
        </form>
    )
}

export default MembershipTypeChooser;
