import React from 'react'

/**
 * Simple text component that can be modified using the customValues array
 * If customValues has values, each value is placed in the first found spot in the text that matches: %{...}
 */
const ResultText = ({text, customValues = []}) => {

    const findCustomPlacement = /%{.*?}/i
    customValues.forEach((customValue) => {     
        text = text.replace(findCustomPlacement, customValue)
    })
    
    return (
        <div>
            {text}
        </div>
    )
}

export default ResultText;
