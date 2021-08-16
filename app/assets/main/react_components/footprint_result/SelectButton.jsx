import React, { useState }  from 'react';
import SelectorMultipleTimes from './SelectorMultipleTimes.jsx';

/**
 * React container for Result page components
 */
const SelectButton = ({selectedMembership, setSelectedMembership, buttonType, preChecked, boldDisplayedText, unBoldDisplayedText}) => {

    return (
        <label className="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
            data-active-class="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" 
            data-inactive-class="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
            htmlFor={buttonType}>
             <input className="flex-shrink-0 mr-2" type="radio" name="membership" id={buttonType} checked = {selectedMembership === buttonType} value={buttonType} onChange={() => setSelectedMembership(buttonType)}
            data-target="registrations--membership-choice.choice" 
            data-action="click->registrations--membership-choice#handleChange"/>        
            
            <span><span className="font-bold">{boldDisplayedText}</span> {unBoldDisplayedText}</span>
            { buttonType == "multi" ?
                    <SelectorMultipleTimes/>
            :
                <div/>
            }
        </label>
    )
}

export default SelectButton;
