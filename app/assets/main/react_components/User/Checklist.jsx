import React from 'react'
import ChecklistItem from './ChecklistItem.jsx'

const Checklist = ({ climateActions, onAccepted }) => {
    return (
        <div className="space-y-3 ">
            {climateActions.map((climateAction) => (
                <ChecklistItem key={climateAction.id} climateAction={climateAction} onAccepted={onAccepted} />
            ))}
        </div>
    );
}

export default Checklist;
