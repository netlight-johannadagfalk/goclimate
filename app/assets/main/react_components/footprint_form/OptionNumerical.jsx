import React, { useEffect, useState } from 'react';
import AnswerButton from './AnswerButton.jsx';

const OptionNumerical = ({
  questionObject,
  onAnswerGiven,
  savedValue,
  onNumericalInput,
}) => {
  const [value, setValue] = useState(savedValue);

  useEffect(() => {
    setValue(savedValue);
    document.getElementsByClassName('input')[0].focus();
  }, [questionObject]);

  return (
    <div className="flex flex-col m-lg:flex-row">
      <label className="input mb-3 m-lg:mb-0 m-lg:mr-3 flex m-lg:w-1/3">
        <input
          autoFocus
          type="text"
          min="0"
          pattern="[0-9]+[.,]?[0-9]*"
          max="2147483647"
          size="7"
          className="flex-1"
          value={value}
          onKeyPress={(e) => {
            if (e.key === 'Enter')
              onAnswerGiven(value.replace(/,/g, '.').replace(/[.]\s*$/, ''));
          }}
          onChange={(e) => {
            if (e.target.validity.valid) {
              setValue(e.target.value);
              onNumericalInput(e.target.value);
            }
          }}
        />
        {questionObject.isCarOption && <span className="ml-3">km</span>}
      </label>
      <AnswerButton
        label={questionObject.text}
        onAnswerGiven={() =>
          onAnswerGiven(value.replace(/,/g, '.').replace(/[.]\s*$/, ''))
        }
        disableOnClick={!questionObject.isCarOption}
        stylingClasses={'m-lg:w-2/3'}
      />
    </div>
  );
};

export default OptionNumerical;
