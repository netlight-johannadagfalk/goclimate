
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
    // const [challenge, setChallenge] = setState(challenges.id)


    const toggleAccepted = (id) => {
        // const challengeToToggle = await fetchChallenge(id)
        // const updateChallenge = {...challengeToToggle, accepted: !challengeToToggle.accepted }

        // const res = FORTSÄTT HÄR

        setChallenges(challenges.map((challenge) => challenge.id === id ? { ...challenge, accepted: !challenge.accepted } : challenge))
    }

    // const useEffect = () => {
    //     fetch(`/categories`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         }
    //     })
    //         .then(res => res.json())
    //         .then(json => console.log(json));
    // // }
    // useEffect(() => {
    //     const getChallenges = async () => {
    //         const challengesFromServer = await fetchChallenges()
    //         setChallenges(challengesFromServer)
    //     }
    //     getChallenges()
    // }, [])


    // //Fetch challenges
    // const fetchChallenges = async () => {
    //     const res = await fetch('http://localhost:3000/challenges')
    //     const data = await res.json()

    //     console.log(data)
    //     return data
    // }

    // //Fetch challenge
    // const fetchChallenge = async (id) => {
    //     const res = await fetch(`http://localhost:3000/challenges/${id}`)
    //     const data = await res.json()

    //     console.log(data)
    //     return data
    // }

    // const addChallenge = async (challenge) => {

    //     const res = await fetch('http:/localhost:3000/challenges', {
    //         method: 'POST',
    //         headers: {
    //             'Content-type': 'application/json'
    //         },
    //         body: JSON.stringify(challenge)
    //     })

    //     const data = res.json()

    //     setChallenges([...challenge, data])

    //     // const id = Math.floor(Math.random() * 10000) + 1

    //     // const newChallenge = { id, ...challenge }
    //     // setChallenges([...challenge, newChallenge])
    // }

    // const deleteChallenge = async (id) => {
    //     await fetch(`http://localhost:3000/challenges/${id}`, {
    //         method: 'DELETE',
    //     })

    //     setChallenges(challenge.filter((challenge) => challenge.id !== id))

    // }


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