import React from 'react';
import AnswerButton from './AnswerButton.jsx';

const OptionList = ({ toNextQuestion, options }) => {

  return (
      <>
      {Object.entries(options).map(([k, o]) => {
        const option = {
          "key": o[0],
          "value": o[1]
        }
        return (
          <AnswerButton key={k} toNextQuestion={toNextQuestion} option={option} />
        )
      })}
      </>
  )
}

export default OptionList;
