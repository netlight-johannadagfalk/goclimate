

import React from 'react'
import { useState } from 'react'
import Button from '../Button.jsx'
import ChecklistItem from './ChecklistItem.jsx'

const Checklist = ({ challenges, ifChecked }) => {

    return (
        <div className="space-y-3 ">
            {challenges.map((challenge) => (
                <ChecklistItem key={challenge.id} challenge={challenge} ifChecked={ifChecked} />
            ))}
        </div>

    );
}
export default Checklist;
