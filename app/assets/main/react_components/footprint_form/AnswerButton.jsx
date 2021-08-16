import React from 'react';

const AnswerButton = ({ onAnswerGiven, label, isSelected }) => {
  let selectedClass = false
  isSelected ? selectedClass = "button-cta " : selectedClass = ""

  return (
    <>
      <input required="required" className="toggler" type="radio" />
      <label onClick={onAnswerGiven} className={"block button toggler-checked:hidden button flex-1 whitespace-pre-wrap " + selectedClass}>{label}</label>
    </>
  )
}

export default AnswerButton;
