import React from 'react';
import SelectButton from './SelectButton.jsx';
import { useTexts } from '../context/Footprint/TextsContext.js';

/**
 * React container for Sign up components
 */
const MembershipTypeSelector = ({
  selectedMembership,
  setSelectedMembership,
  multipleOffsets,
  setMultipleOffsets,
}) => {
  const {
    registrationsText: {
      membership: { free, single, multi },
    },
  } = useTexts();

  return (
    <div className="space-y-3 text-left">
      <SelectButton
        selectedMembership={selectedMembership}
        setSelectedMembership={setSelectedMembership}
        buttonType="free"
        text={free}
        multipleOffsets={multipleOffsets}
        setMultipleOffsets={setMultipleOffsets}
      />
      <SelectButton
        selectedMembership={selectedMembership}
        setSelectedMembership={setSelectedMembership}
        buttonType="single"
        text={single}
        multipleOffsets={multipleOffsets}
        setMultipleOffsets={setMultipleOffsets}
      />
      <SelectButton
        selectedMembership={selectedMembership}
        setSelectedMembership={setSelectedMembership}
        buttonType="multi"
        text={multi}
        multipleOffsets={multipleOffsets}
        setMultipleOffsets={setMultipleOffsets}
      />
    </div>
  );
};

export default MembershipTypeSelector;
