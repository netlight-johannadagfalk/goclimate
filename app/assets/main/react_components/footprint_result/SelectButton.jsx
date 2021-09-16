import React from 'react';
import SelectorMultipleTimes from './SelectorMultipleTimes.jsx';

const SelectButton = ({
  selectedMembership,
  setSelectedMembership,
  buttonType,
  title,
  desc,
  multipleOffsets,
  setMultipleOffsets,
}) => {
  const style =
    'flex flex-row items-center p-3 rounded cursor-pointer mt-3 border border-green-accent ' +
    (buttonType === selectedMembership ? 'bg-green-tint-1' : '');

  desc = desc.replace('%{num}', multipleOffsets.toString());

  return (
    <label className={style} htmlFor={buttonType}>
      <input
        className="flex-shrink-0 mr-2"
        type="radio"
        name="membership"
        id={buttonType}
        checked={selectedMembership === buttonType}
        value={buttonType}
        onChange={() => setSelectedMembership(buttonType)}
      />
      <span>
        <span className="font-bold">{title}</span>
        <br></br>
        {desc}
      </span>
      {buttonType == 'multi' && (
        <SelectorMultipleTimes
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
        />
      )}
    </label>
  );
};

export default SelectButton;
