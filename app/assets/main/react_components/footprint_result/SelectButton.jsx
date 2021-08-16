import React from 'react';
import SelectorMultipleTimes from './SelectorMultipleTimes.jsx';

/**
 * React container for Result page components
 */
const SelectButton = ({buttonType, preChecked, boldDisplayedText, unBoldDisplayedText}) => {

    console.log("SelectButton render")
    console.log("preChecked", preChecked)

    function isPreChecked() {
        if (preChecked) {
            return <input className="flex-shrink-0 mr-2" type="radio" name="membership" id={buttonType} value={buttonType}
            checked
            data-target="registrations--membership-choice.choice" 
            data-action="click->registrations--membership-choice#handleChange"/>            
        } else {
            return <input className="flex-shrink-0 mr-2" type="radio" name="membership" id={buttonType} value={buttonType}
            data-target="registrations--membership-choice.choice" 
            data-action="click->registrations--membership-choice#handleChange"/>            
        }
    }
    return (
        <label className="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
            data-active-class="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" 
            data-inactive-class="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" 
            htmlFor={buttonType}>
            {isPreChecked()}
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
