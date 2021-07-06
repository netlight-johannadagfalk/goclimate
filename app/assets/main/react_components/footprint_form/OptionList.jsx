import React from 'react';
import AnswerButton from './AnswerButton.jsx';

const OptionList = ({ onAnswerGiven, options }) => {

  return (
      <>
        {Object.entries(options).map(([k, o]) => {
          const option = {
            "key": o[0],
            "value": o[1]
          }
          return (
            <div className="my-3 flex-1">
              <AnswerButton key={k} onAnswerGiven={() => onAnswerGiven(option.key)} option={option} />
            </div>
          )
        })}
      </>
  )
}

export default OptionList;
