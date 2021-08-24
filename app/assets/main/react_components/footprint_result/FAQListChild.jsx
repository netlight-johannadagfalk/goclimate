import React, { useState } from 'react'

const FAQListChild = ({ question, answer }) => {
    const [collapseState, setCollapseState] = useState("hidden")
    const [chevronState, setChevronState] = useState("")

    function getAnswerBlock(answer){
        if(!answer.includes("<br>")){
            return <div className={"pt-4 " + collapseState}>{answer}</div>
        }
        let splittedAnswer = answer
        let returnDiv = <></>
        while(splittedAnswer.includes("<br><br>")){

        }
        return (
            <>
                {answer.substring(0, answer.indexOf("<br>"))}
                <br></br> <br></br>
                {answer.substring(answer.indexOf("<br><br>") + 8, answer.length)}
            </>
        )
    }

    const address_number = "10 Downing Street";
    const prime_minister_address = `The Prime Minister's address is ${address_number}.`;
    console.log(prime_minister_address)
    return (
        <div className="block border p-3 rounded text-left collapse">
            <div className="flex justify-between cursor-pointer" 
                onClick={() => {
                    setChevronState(collapseState === "hidden" ? "transform rotate-180" : "")
                    setCollapseState(collapseState === "hidden" ? "block" : "hidden")
                }}>
                <div className="font-semibold">{question}</div>
                <div className="pl-3">
                    <i id="faqChevron" className={"fas fa-chevron-circle-down transition-transform ease-in-out duration-300 " + chevronState} aria-hidden="true"/>
                </div>
            </div>
            {
                <div dangerouslySetInnerHTML={{__html: answer}}></div>
            }
        </div>
    )
}

export default FAQListChild
