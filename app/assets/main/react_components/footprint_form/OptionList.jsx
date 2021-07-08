import React from 'react';
import AnswerButton from './AnswerButton.jsx';

/**
 * Receives a list of all options for a specific question, and maps 
 */
const OptionList = ({ onAnswerGiven, options }) => {

  return (
      <>
        {options.map((option) => {
          const optionObject = {
            "key": option[0],
            "value": option[1]
          }
          console.log(optionObject);
          return (
            <div key={optionObject.key} className="my-3 flex-1">
              <AnswerButton 
                onAnswerGiven={() => onAnswerGiven(optionObject.key)} 
                option={optionObject} 
              />
            </div>
          )
        })}
      </>
  )
}

export default OptionList;
