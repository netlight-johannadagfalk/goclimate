import React from 'react';

/**
 * React container for select tag containing options for multiple people donation
 */
const SelectorMultipleTimes = ({currentMultipleValue, setCurrentMultipleValue}) => {

    function generateOptions(from, to) {
        let itemList=[]
        for (var i=from; i <= to; i++) {
                itemList.push(<option value={i} key={i}>{i}</option>)
        } 
        return itemList;
    }

    function handleChange(event){
        setCurrentMultipleValue(event.target.value)
    }
    
    return (
        <div className="select-wrapper flex-shrink-0">
            <select value={currentMultipleValue} onChange={handleChange} className="select" name="people" id="people">
                {generateOptions(2,20)}
            </select>
        </div>
    )
}

export default SelectorMultipleTimes;
