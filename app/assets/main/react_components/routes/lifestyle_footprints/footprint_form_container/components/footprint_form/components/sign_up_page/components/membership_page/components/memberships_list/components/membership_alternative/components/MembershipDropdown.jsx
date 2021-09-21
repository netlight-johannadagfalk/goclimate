import React from 'react';

const MembershipDropdown = ({ multipleOffsets, setMultipleOffsets }) => {
  return (
    <div className="select-wrapper flex-shrink-0">
      <select
        value={multipleOffsets}
        onChange={(e) => setMultipleOffsets(e.target.value)}
        className="select border border-green-accent my-4 mx-2"
        name="people"
        id="people"
      >
        {Array.from({ length: 19 }, (_, i) => i + 2).map((optionValue) => (
          <option value={optionValue} key={optionValue}>
            {optionValue}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MembershipDropdown;
