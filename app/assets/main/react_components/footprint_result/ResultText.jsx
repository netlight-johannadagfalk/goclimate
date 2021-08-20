import React from 'react'

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
