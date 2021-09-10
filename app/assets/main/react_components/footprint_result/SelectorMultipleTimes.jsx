import React from 'react';

const SelectorMultipleTimes = ({ multipleOffsets, setMultipleOffsets }) => {
  return (
    <div className='select-wrapper flex-shrink-0'>
      <select
        value={multipleOffsets}
        onChange={(e) => setMultipleOffsets(e.target.value)}
        className='select'
        name='people'
        id='people'
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((optionValue) => (
          <option value={optionValue} key={optionValue}>
            {optionValue}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectorMultipleTimes;
