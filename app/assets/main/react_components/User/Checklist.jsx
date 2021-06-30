

import React from 'react'
import ChecklistItem from './ChecklistItem.jsx'

const Checklist = ({ challenges, ifChecked, isOnlyAccepted }) => {

    return (
        <div className="space-y-3 ">
            {isOnlyAccepted ?
                challenges.map((challenge) => (challenge.accepted ?
                    <ChecklistItem key={challenge.id} challenge={challenge} ifChecked={ifChecked} /> : ''
                ))
                :
                challenges.map((challenge) => (
                    <ChecklistItem key={challenge.id} challenge={challenge} ifChecked={ifChecked} />
                ))
            }
        </div>

    );
}
export default Checklist;
