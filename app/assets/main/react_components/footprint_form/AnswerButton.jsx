import React, { useState } from 'react';

const AnswerButton = ({ onAnswerGiven, label, isSelected, disableOnClick = false }) => {
  let selectedClass = isSelected ? "button-cta " : "";
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      <button disabled={disabled} className={"button w-full " + selectedClass} 
        onClick={() => {
          if(disableOnClick)
            setDisabled(true);
          onAnswerGiven();
        }}
      >
        {label}
      </button>
    </>
  )
}
export default AnswerButton;
