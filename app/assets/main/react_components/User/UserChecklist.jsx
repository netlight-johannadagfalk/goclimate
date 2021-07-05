import React from 'react'
import UserChecklistItem from './UserChecklistItem.jsx'

const UserChecklist = ({ userClimateActions, onAccepted, onPerformed, isPerformed }) => {
    return (
        <div className="space-y-3 ">
            {isPerformed ?
                userClimateActions.map((userClimateAction) => (userClimateAction.status ?
                    <UserChecklistItem key={userClimateAction.id} userClimateAction={userClimateAction} onAccepted={onAccepted} onPerformed={onPerformed} /> : '')) :
                userClimateActions.map((userClimateAction) => (
                    <UserChecklistItem key={userClimateAction.id} userClimateAction={userClimateAction} onPerformed={onPerformed} />
                ))
            }
        </div>
    );
}

export default UserChecklist;
