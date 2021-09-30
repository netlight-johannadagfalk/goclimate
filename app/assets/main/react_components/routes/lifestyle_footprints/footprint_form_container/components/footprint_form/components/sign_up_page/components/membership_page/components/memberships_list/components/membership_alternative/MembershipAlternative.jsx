import React from 'react';
import MembershipDropdown from './components/MembershipDropdown.jsx';

const MembershipAlternative = ({
  selectedMembership,
  setSelectedMembership,
  buttonType,
  title,
  desc,
  multipleOffsets,
  setMultipleOffsets,
}) => {
  const style =
    'flex flex-row items-center p-3 rounded cursor-pointer mt-3 border-2 shadow-lg' +
    (buttonType === selectedMembership
      ? ' bg-green-tint-1 '
      : ' border-gray-tint-1 ');

  desc = desc.replace(/%{.*?}/i, multipleOffsets.toString());

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
        <MembershipDropdown
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
        />
      )}
    </label>
  );
};

export default MembershipAlternative;
