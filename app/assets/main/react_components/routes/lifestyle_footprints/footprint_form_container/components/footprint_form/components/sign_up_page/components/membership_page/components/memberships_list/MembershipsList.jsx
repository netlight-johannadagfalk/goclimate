import React from 'react';
import { useTexts } from '../../../../../../../../../contexts/TextsContext.js';
import MembershipAlternative from './components/membership_alternative/MembershipAlternative.jsx';

const MembershipsList = ({
  selectedMembership,
  setSelectedMembership,
  multipleOffsets,
  setMultipleOffsets,
}) => {
  const {
    reactContentText: {
      memberships_v1: {
        free_title,
        free_desc,
        single_title,
        single_desc,
        multi_title,
        multi_desc,
      },
    },
  } = useTexts();

  return (
    <div className="space-y-3 text-left">
      <MembershipAlternative
        selectedMembership={selectedMembership}
        setSelectedMembership={setSelectedMembership}
        buttonType="free"
        title={free_title}
        desc={free_desc}
        multipleOffsets={multipleOffsets}
        setMultipleOffsets={setMultipleOffsets}
      />
      <MembershipAlternative
        selectedMembership={selectedMembership}
        setSelectedMembership={setSelectedMembership}
        buttonType="single"
        title={single_title}
        desc={single_desc}
        multipleOffsets={multipleOffsets}
        setMultipleOffsets={setMultipleOffsets}
      />
      <MembershipAlternative
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

export default MembershipsList;
