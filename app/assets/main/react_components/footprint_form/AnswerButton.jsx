import React from 'react';

const AnswerButton = ({ onAnswerGiven, option }) => {
  return (
    <>
      <input required="required" className="toggler" type="radio" />
      <label onClick={onAnswerGiven} className="block button toggler-checked:hidden button flex-1">{option.value}</label>
    </>
  )
}

export default AnswerButton;
