import React from 'react';
import AnswerButton from './AnswerButton.jsx';

/**
 * Receives a list of all options for a specific question, and maps 
 */
const OptionList = ({ onAnswerGiven, options, selectedKey }) => {

  return (
      <>
        {
        options.map(([key, value]) => {
          return (
            <div key={key} className="my-3 flex-1">
              <AnswerButton 
                label={value} 
                onAnswerGiven={() => onAnswerGiven(key)} 
                stylingClasses={(selectedKey == key && "button-cta") + " w-full"}
              />
            </div>
          )
        })}
      </>
  )
}

export default OptionList;
