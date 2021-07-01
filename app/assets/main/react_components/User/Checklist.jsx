import React from 'react'
import ChecklistItem from './ChecklistItem.jsx'

const Checklist = ({ climateActions, onCheck, isOnlyAccepted }) => {
    return (
        <div className="space-y-3 ">
            {isOnlyAccepted ?
                climateActions.map((climateAction) => (climateAction.accepted ?
                    <ChecklistItem key={climateAction.id} climateAction={climateAction} onCheck={onCheck} /> : '')) :
                climateActions.map((climateAction) => (
                    <ChecklistItem key={climateAction.id} climateAction={climateAction} onCheck={onCheck} />
                ))
            }
        </div>
    );
}

export default Checklist;
