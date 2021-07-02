
import React from 'react'
import { useState } from 'react'
import Checklist from './Checklist.jsx'
import ChecklistHeader from './ChecklistHeader.jsx'
import ChecklistFooter from './ChecklistFooter.jsx'

const ClimateActionContainer = ({climateActionsProps}) => {
    const [climateActions, setClimateActions] = useState(JSON.parse(climateActionsProps))
    

    const onCheck = (id) => {
        setClimateActions(climateActions.map((climateAction) => climateAction.id === id ? { ...climateAction, accepted: !climateAction.accepted } : climateAction))
    }

    return (
        <div>
            <div className="max-w-5xl mx-auto space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2">
                <ChecklistHeader />
                <div className="flex flex-col t:flex-row t:space-x-8 space-y-6 t:space-y-0">
                  <div className="t:w-1/2 space-y-6"><Checklist climateActions={climateActions} onCheck={onCheck} isOnlyAccepted={false} />
                    </div>
                    <div className="t:w-1/2 space-y-6">
                        <Checklist climateActions={climateActions} onCheck={onCheck} isOnlyAccepted={true} />
                    </div>
                </div>
            </div>
            <ChecklistFooter />
        </div>
    );
}

export default ClimateActionContainer;