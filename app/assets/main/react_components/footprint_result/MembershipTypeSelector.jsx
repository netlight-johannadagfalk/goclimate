import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import SelectButton from './SelectButton.jsx';

const MembershipTypeSelector = ({ selectedMembership, setSelectedMembership, multipleOffsets, setMultipleOffsets}) => {

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
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="free" desc={free_desc} title={free_title}
                multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="single" desc={single_desc} title={single_title}
                multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
            />
            <SelectButton 
                selectedMembership={selectedMembership} setSelectedMembership={setSelectedMembership} 
                buttonType="multi" desc={multi_desc} title={multi_title}
                multipleOffsets={multipleOffsets} setMultipleOffsets={setMultipleOffsets}
            />
        </div>
    )
}

export default MembershipTypeSelector;
