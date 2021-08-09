import React from 'react';
import AnswerButton from './AnswerButton.jsx';

/**
 * Receives a list of all options for a specific question, and maps 
 */
const OptionList = ({ onAnswerGiven, options }) => {

  return (
      <>
        {options.map((option) => {
          return (
            <div key={option[0]} className="my-3 flex-1">
              <AnswerButton 
                onAnswerGiven={() => onAnswerGiven(option[0])} 
                labelText={option[1]} 
              />
            </div>
          )
        })}
      </>
  )
}

export default OptionList;
