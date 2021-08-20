import React, { useState }  from 'react';
import SelectorMultipleTimes from './SelectorMultipleTimes.jsx';

/**
 * React container for select puttons 
 */
const SelectButton = ({selectedMembership, setSelectedMembership, buttonType, text}) => {

    var text = text.split("</span>")
    var boldText = text[0].replace("<span>","")
    var unBoldText = text[1]

    return (
        <label className="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
            data-active-class="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" 
            data-inactive-class="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
            htmlFor={buttonType}>
            <input className="flex-shrink-0 mr-2" type="radio" name="membership" id={buttonType} 
                checked = {selectedMembership === buttonType} 
                value={buttonType} 
                onChange={() => setSelectedMembership(buttonType)}
                data-target="registrations--membership-choice.choice" 
                data-action="click->registrations--membership-choice#handleChange"/>        
            <span><span className="font-bold">{boldText}</span>{unBoldText}</span>
            { buttonType == "multi" ?
                    <SelectorMultipleTimes/>
            :
                <div/>
            }
        </label>
    )
}

export default SelectButton;
