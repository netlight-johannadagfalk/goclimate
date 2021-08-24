import React, { useState } from 'react'
// Used as good practice in order to prevent unwanted HTML when using dangerouslySetInnterHTML
import sanitizeHtml from 'sanitize-html';

/**
 * Single FAQ list object
 * collapseState is used to check whether or not the list object should be expanded or not
 */
const FAQListChild = ({ question, answer }) => {
    const [collapseState, setCollapseState] = useState("hidden")

    return (
        <div className="block border p-3 rounded text-left collapse">
            <div className="flex justify-between cursor-pointer" onClick={() => setCollapseState(collapseState === "hidden" ? "block" : "hidden")}>
                <div className="font-semibold">{question}</div>
                <div className="pl-3">
                    <i className={"fas fa-chevron-circle-down transition-transform ease-in-out duration-300 " + (collapseState !== "hidden" && "transform rotate-180") } aria-hidden="true"/>
                </div>
            </div>
            <div className={"inject-link pt-4 collapse-content " + collapseState}
                dangerouslySetInnerHTML={{__html: sanitizeHtml(answer)}}>
            </div>
        </div>
    )
}

export default FAQListChild
