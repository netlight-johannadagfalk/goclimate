import React from 'react'
import Title from './Title.jsx'
import OptionList from './OptionList.jsx'
import OptionNumerical from './OptionNumerical.jsx'

/**
 * Container for FootprintForm page that is related to questions
 * Either shows a numerical or a button-based question
 */
const QuestionPage = ({ currentObject, onAnswerGiven, selectedKey, onNumericalInput, savedValue}) => {
    return (
        <div>
            <Title text={currentObject.question}/>
            {!currentObject.isNumerical ? 
                <OptionList 
                    onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} 
                    options={currentObject.options}
                    selectedKey={selectedKey} 
                />
                :
                <OptionNumerical 
                    questionObject={currentObject}
                    onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} 
                    option={currentObject.options} 
                    onNumericalInput={onNumericalInput}
                    savedValue={savedValue} 
                />
            }
        </div>
    )
}

export default QuestionPage
