import React from 'react'
import Title from './Title.jsx'
import OptionList from './OptionList.jsx'
import OptionNumerical from './OptionNumerical.jsx'

/**
 * Container for FootprintForm page that is related to questions
 * Either shows a numerical or a button-based question
 */
const QuestionPage = ({ question, options, onAnswerGiven, selectedKey, onNumericalInput, savedValue}) => {
    return (
        <div>
            <Title text={question}/>
            {!options.isNumerical ? 
                <OptionList 
                    onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} 
                    options={options.options}
                    selectedKey={selectedKey} 
                />
                :
                <OptionNumerical 
                    onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} 
                    option={options} 
                    onNumericalInput={onNumericalInput}
                    savedValue={savedValue} 
                />
            }
        </div>
    )
}

export default QuestionPage