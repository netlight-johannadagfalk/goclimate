import React from 'react';

const AnswerButton = ({ onAnswerGiven, option, isSelected }) => {
  let selectedClass = false
  isSelected ? selectedClass = "button-cta " : selectedClass = ""

  return (
    <>
      <input required="required" className="toggler" type="radio" />
      <label onClick={onAnswerGiven} className={"block button toggler-checked:hidden button flex-1 " + selectedClass}>{option}</label>
    </>
  )
}

export default AnswerButton;
