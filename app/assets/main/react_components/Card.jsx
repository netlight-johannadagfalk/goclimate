
import React from 'react'
import { useState } from 'react'

const Card = () => {
    const [challenges, setChallenges] = useState([
        {
            id: 1,
            text: 'Go Vegan',
            category: 'Food',
            emoji: '🥗',
        },
        {
            id: 2,
            text: 'No flying',
            category: 'Transport',
            emoji: '🛬',
        },
        {
            id: 3,
            text: 'Take the bike',
            category: 'Transport',
            emoji: '🚲',
        },
        {
            id: 1,
            text: 'Go Vegan',
            category: 'Food',
            emoji: '🥗',
        },
        {
            id: 2,
            text: 'No flying',
            category: 'Transport',
            emoji: '🛬',
        },
        {
            id: 3,
            text: 'Take the bike',
            category: 'Transport',
            emoji: '🚲',

        },
    ])


    return (
        <div className="max-w-5xl mx-auto space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2">
            <h3 className="heading-lg mb-3">Action Challenges</h3>

            <p className="font-bold inline-block text-green-accent py-1 px-2 -ml-2 rounded" >Choose your actions:</p>

            <div className="flex flex-col t:flex-row t:space-x-8 space-y-6 t:space-y-0">
                <form>
                    {challenges.map((challenge) => (
                        <div className="callout space-y-6 ml-lg">
                            <label className="space-x-6 text-xl font-bold">
                                <input type="checkbox" key={challenge.id} />
                                {' ' + challenge.text}
                                {' ' + challenge.emoji}
                            </label>
                        </div>
                    ))}
                </form>
            </div>
        </div>

    );
}
export default Card;