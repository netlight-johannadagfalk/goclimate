import React from 'react'
import { useState } from 'react'
import Checklist from './Checklist.jsx'
import UserChecklist from './UserChecklist.jsx'

function Kanban({ climateActionsProps, userClimateActionsProps }) {
    const [climateActions, setClimateActions] = useState(JSON.parse(climateActionsProps))
    const [userClimateActions, setUserClimateActions] = useState(JSON.parse(userClimateActionsProps))

    const onAccepted = (id) => {
        // POST new relation
    }

    const onPerformed = (id) => {
        // PUT
        setUserClimateActions(userClimateActions.map((userClimateAction) => userClimateAction.id === id ? { ...userClimateAction, status: !userClimateAction.status } : userClimateAction))
    }

    return (
        <div className="flex flex-col t:flex-row t:space-x-8 space-y-6 t:space-y-0">
            <div className="t:w-1/3 space-y-6 callout max-w-2xl">
                <p className="font-bold inline-block text-green-accent py-1 px-2 -ml-2 rounded" >Choose your actions:</p>
                <Checklist climateActions={climateActions} onAccepted={onAccepted} />
            </div>
            <div className="t:w-1/3 space-y-6 callout max-w-2xl">

                <p className="font-bold inline-block text-green-accent py-1 px-2 -ml-2 rounded" >Your accepted actions:</p>
                <UserChecklist userClimateActions={userClimateActions} onPerformed={onPerformed} isPerformed={false} />
            </div>
            <div className="t:w-1/3 space-y-6 callout max-w-2xl">

                <p className="font-bold inline-block text-green-accent py-1 px-2 -ml-2 rounded" >Your performed actions:</p>
                <UserChecklist userClimateActions={userClimateActions} onAccepted={onAccepted} onPerformed={onPerformed} isPerformed={true} />
            </div>
        </div>
    )
}

export default Kanban
