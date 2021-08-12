import React from 'react';

const AnswerButton = ({ onAnswerGiven, labelText }) => {

  return (
    <>
      <input required="required" className="toggler" type="radio" />
      <label onClick={onAnswerGiven} className="block button toggler-checked:hidden button flex-1 whitespace-pre-wrap">{labelText}</label>
    </>
  )
}

export default AnswerButton;
