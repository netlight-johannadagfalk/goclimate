import React from 'react';
import SelectorMultipleTimes from './SelectorMultipleTimes.jsx';

/**
 * React container for select buttons 
 */
const SelectButton = ({selectedMembership, setSelectedMembership, buttonType, text, multipleOffsets, setMultipleOffsets}) => {

    var text = text.split("</span>")
    var boldText = text[0].replace("<span>","")
    var unBoldText = text[1]

    const style = "flex flex-row items-center p-3 rounded cursor-pointer border border-green-accent " + (buttonType === selectedMembership ? "bg-green-tint-1" : "")

    return (
        <label className={style}
            htmlFor={buttonType}>
            <input className="flex-shrink-0 mr-2" type="radio" name="membership" id={buttonType} 
                checked = {selectedMembership === buttonType} 
                value={buttonType} 
                onChange={() => setSelectedMembership(buttonType)}
            />        
            <span>
                <span className="font-bold">
                    {boldText}
                </span>
                {unBoldText}
            </span>
            { buttonType == "multi" && 
                <SelectorMultipleTimes
                    multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
                /> 
            }
        </label>
    )
}

export default SelectButton;
