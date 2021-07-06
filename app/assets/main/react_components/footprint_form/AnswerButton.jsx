import React from 'react';

const AnswerButton = ({ toNextQuestion, option }) => {
  return (
    <div className="my-3" onClick={() => toNextQuestion(option.key)}>
        <input required="required" className="toggler" type="radio"/>
        <label className="hidden button button-cta toggler-checked:block">{option.key}</label>
        <label className="block button toggler-checked:hidden">{option.value}</label>
    </div>
  )
}

export default AnswerButton;

