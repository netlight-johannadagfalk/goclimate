

import React from 'react'
import Button from '../Button.jsx'
import ChecklistItem from './ChecklistItem.jsx'

const AcceptedActionsList = ({ challenges, ifChecked }) => {

    return (
        <div className="space-y-3 " >
            {challenges.map((challenge) => (challenge.accepted ? true :
                <ChecklistItem key={challenge.id} challenge={challenge} ifChecked={ifChecked} />
            ))}
        </div>

    );
}
export default AcceptedActionsList;


