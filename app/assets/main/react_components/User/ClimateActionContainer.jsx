
import React from 'react'
import { useState } from 'react'
import Checklist from './Checklist.jsx'
import ChecklistHeader from './ChecklistHeader.jsx'
import ChecklistFooter from './ChecklistFooter.jsx'

const ClimateActionContainer = () => {
    const [climateActions, setClimateActions] = useState([
        {
            id: 1,
            text: 'Go Vegan',
            category: 'Food',
            emoji: '🥗',
            accepted: false,
        },
        {
            id: 2,
            text: 'No flying',
            category: 'Transport',
            emoji: '🛬',
            accpeted: false,
        },
        {
            id: 3,
            text: 'Take the bike',
            category: 'Transport',
            emoji: '🚲',
            accpeted: false,
        },
        {
            id: 4,
            text: 'Contact politician',
            category: 'Politics',
            emoji: '🏛',
            accpeted: false,
        },
        {
            id: 5,
            text: 'Demonstrate',
            category: 'Politics',
            emoji: '🏛',
            accpeted: false,
        },
        {
            id: 6,
            text: 'Veggie month!',
            category: 'Food',
            emoji: '🥗',
            accpeted: false,

        },
    ])

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