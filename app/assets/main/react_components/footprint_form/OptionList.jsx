import React from 'react';
import AnswerButton from './AnswerButton.jsx';

/**
 * Receives a list of all options for a specific question, and maps 
 */
const OptionList = ({ onAnswerGiven, options, selectedKey }) => {
  let myobject = Object.fromEntries(options)
  //console.log(myobject.keys)
  return (
      <>
        {
        options.map(([key, value]) => {
          return (
            <div key={key} className="my-3 flex-1">
              <AnswerButton 
                onAnswerGiven={() => onAnswerGiven(key)} 
                option={value}
                isSelected = {selectedKey==key}
                labelText={value} 
              />
            </div>
          )
        })}
      </>
  )
}
export default OptionList;
