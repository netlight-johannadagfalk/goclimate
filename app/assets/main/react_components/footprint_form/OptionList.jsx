import React from 'react';
import AnswerButton from './AnswerButton.jsx';

/**
 * Receives a list of all options for a specific question, and maps 
 */
const OptionList = ({ onAnswerGiven, options, selectedKey }) => {

  return (
      <>
        {options.map((option) => {
          const optionObject = {
            "key": option[0],
            "value": option[1]
          }
          return (
            <div key={optionObject.key} className="my-3 flex-1">
              <AnswerButton 
                onAnswerGiven={() => onAnswerGiven(optionObject.key)} 
                option={optionObject.value}
                isSelected = {selectedKey==optionObject.key}
                labelText={optionObject.value} 
              />
            </div>
          )
        })}
      </>
  )
}

export default OptionList;
