import React from 'react';

/**
 * React container for select tag containing options for multiple people donation
 */
const SelectorMultipleTimes = () => {

    function generateOptions(from, to) {
        let itemList=[]
        for (var i=from; i <= to; i++) {
            if (i === from){
                itemList.push(<option selected="selected" value={i}>{i}</option>)
            } else {
                itemList.push(<option value={i}>{i}</option>)
            }
        } 
        return itemList;
    }

    return (
        <select className="select" data-action="change->registrations--membership-choice#chooseMulti" name="people" id="people"S>
            {generateOptions(2,20)}
        </select>
    )
}

export default SelectorMultipleTimes;
