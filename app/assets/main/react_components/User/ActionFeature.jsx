
import React from 'react'
import { useState } from 'react'
import Checklist from './Checklist.jsx'
import ChecklistHeader from './ChecklistHeader.jsx'
import ChecklistFooter from './ChecklistFooter.jsx'
import AcceptedActionsList from './AcceptedActionsList.jsx'

const ActionFeature = () => {
    const [challenges, setChallenges] = useState([
        {
            id: 1,
            text: 'Go Vegan',
            category: 'Food',
            emoji: '🥗',
            accepted: true,
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
            text: 'Go Vegan',
            category: 'Food',
            emoji: '🥗',
            accpeted: false,
        },
        {
            id: 5,
            text: 'No flying',
            category: 'Transport',
            emoji: '🛬',
            accpeted: false,
        },
        {
            id: 6,
            text: 'Take the bike',
            category: 'Transport',
            emoji: '🚲',
            accpeted: false,

        },
    ])
    const toggleAccepted = (id) => {
        setChallenges(challenges.map((challenge) => challenge.id === id ? { ...challenge, accepted: !challenge.accepted } : challenge))
    }




    return (
        <div>
            <div className="max-w-5xl mx-auto space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2">
                <ChecklistHeader />

                <div class="flex flex-col t:flex-row t:space-x-8 space-y-6 t:space-y-0">
                    <div class="t:w-1/2 space-y-6">
                        <Checklist challenges={challenges} ifChecked={toggleAccepted} />

                    </div>
                    <div class="t:w-1/2 space-y-6">

                        <AcceptedActionsList challenges={challenges} ifChecked={toggleAccepted} />
                    </div>
                </div>
            </div>
            <ChecklistFooter />
        </div>
    );
}
export default ActionFeature;