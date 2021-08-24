import React from 'react';

/**
 * React container for select tag containing options for multiple people donation
 */
const SelectorMultipleTimes = () => {

    function generateOptions(from, to) {
        let itemList=[]
        for (var i=from; i <= to; i++) {
            if (i === from){
                itemList.push(<option defaultValue value={i} key={i}>{i}</option>)
            } else {
                itemList.push(<option value={i} key={i}>{i}</option>)
            }
        } 
        return itemList;
    }

    return (
        <div className="select-wrapper flex-shrink-0">
            <select className="select" name="people" id="people">
                {generateOptions(2,20)}
            </select>
        </div>
    )
}

export default SelectorMultipleTimes;
