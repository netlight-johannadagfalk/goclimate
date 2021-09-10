import React from 'react';

/**
 * React container for select tag containing options for multiple people donation
 */
const SelectorMultipleTimes = ({ multipleOffsets, setMultipleOffsets }) => {
  const generateOptions = (from, to) => {
    let itemList = [];
    for (var i = from; i <= to; i++) {
      itemList.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }
    return itemList;
  };

  return (
    <div className='select-wrapper flex-shrink-0'>
      <select
        value={multipleOffsets}
        onChange={(e) => setMultipleOffsets(e.target.value)}
        className='select'
        name='people'
        id='people'
      >
        {generateOptions(2, 20)}
      </select>
    </div>
  );
};

export default SelectorMultipleTimes;
