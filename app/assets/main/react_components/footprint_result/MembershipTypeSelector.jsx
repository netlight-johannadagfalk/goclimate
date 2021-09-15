import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import SelectButton from './SelectButton.jsx';

const MembershipTypeSelector = ({
  selectedMembership,
  setSelectedMembership,
  multipleOffsets,
  setMultipleOffsets,
}) => {
  const { 
    reactContentText: {
      react: { 
              memberships: { 
                  free_title, 
                  free_desc, 
                  single_title, 
                  single_desc, 
                  multi_title, 
                  multi_desc 
              }         
            }
        }  
    } = useTexts();

  return (
    <div className="space-y-3 text-left">
      <SelectButton
        selectedMembership={selectedMembership}
        setSelectedMembership={setSelectedMembership}
        buttonType="free"
        title={free_title}
        desc={free_desc}
        multipleOffsets={multipleOffsets}
        setMultipleOffsets={setMultipleOffsets}
      />
      <SelectButton
        selectedMembership={selectedMembership}
        setSelectedMembership={setSelectedMembership}
        buttonType="single"
        title={single_title}
        desc={single_desc}
        multipleOffsets={multipleOffsets}
        setMultipleOffsets={setMultipleOffsets}
      />
      <SelectButton
        selectedMembership={selectedMembership}
        setSelectedMembership={setSelectedMembership}
        buttonType="multi"
        title={multi_title}
        desc={multi_desc}
        multipleOffsets={multipleOffsets}
        setMultipleOffsets={setMultipleOffsets}
      />
    </div>
  );
};

export default MembershipTypeSelector;
