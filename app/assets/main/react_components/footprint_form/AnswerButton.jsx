import React, { useState } from 'react';

/**
 * A simple styled button component
 */
const AnswerButton = ({
  label,
  onAnswerGiven,
  disableOnClick = false,
  stylingClasses = '',
}) => {
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      <button
        disabled={disabled}
        className={'button whitespace-pre-wrap ' + stylingClasses}
        onClick={() => {
          if (disableOnClick) setDisabled(true);
          onAnswerGiven();
        }}
      >
        {label}
      </button>
    </>
  );
};
export default AnswerButton;
