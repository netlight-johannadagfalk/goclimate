import React from 'react';

/**
 * React container for select tag containing options for multiple people donation
 */
const SelectorMultipleTimes = ({multipleOffsets, setMultipleOffsets}) => {

    function generateOptions(from, to) {
        let itemList=[]
        for (var i=from; i <= to; i++) {
                itemList.push(<option value={i} key={i}>{i}</option>)
        } 
        return itemList;
    }

    function handleChange(event){
        setMultipleOffsets(event.target.value)
    }
    
    return (
        <div className="select-wrapper flex-shrink-0">
            <select value={multipleOffsets} onChange={handleChange} className="select ml-2 border border-green-accent " name="people" id="people">
                {generateOptions(2,20)}
            </select>
        </div>
    )
}

export default SelectorMultipleTimes;
