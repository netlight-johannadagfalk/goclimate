import React from 'react'
import FAQListChild from './FAQListChild.jsx'

const FAQ = ({ questions, faqText }) => {

    let faqQuestions = []

    const questionKeys = {
        climate_neutrality: ["q2"],
        offsetting: ["q2", "q3", "q6", "q9", "q11"],
        our_service: ["q1", "q3", "q4"]
    }

    Object.keys(questionKeys).forEach((category) => {
        const quest = Object.entries(questions[category].questions).filter(([q])=> {
            return questionKeys[category].includes(q)
        })
        quest.forEach((q) => faqQuestions.push(q[1]))
    })
    
    return (
        <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="heading">{faqText}</h2>
            {
                faqQuestions.map((question) => {
                    console.log(question.answer);
                    return (
                        <FAQListChild key={question.question} question={question.question} answer={question.answer} />
                    )
                })
            }
            
        </div>
    )
}

export default FAQ
