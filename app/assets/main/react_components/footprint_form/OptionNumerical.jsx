import React, { useState, useEffect }  from 'react';
import AnswerButton from './AnswerButton.jsx';

const OptionNumerical = ({ onAnswerGiven, isCarOption, savedValue, onNumericalInput }) => {
  const [value, setValue] = useState(savedValue);
  
  useEffect(() => {
    setValue(savedValue)
  }, [savedValue])

  function onKeyPress(e){
    if (e.key === 'Enter') {
      setValue("");
      onNumericalInput("");
      onAnswerGiven(value.replace(/,/g, '.').replace(/[.]\s*$/, ""));
    }
  }

  function onChange(e){
    /* Checks if input is valid compared to set requirements  */
    if(e.target.validity.valid){
      setValue(e.target.value);
      onNumericalInput(e.target.value);
    }
  }

  function onAnswer(){
    setValue("");
    document.getElementsByClassName("input")[0].focus();
    /* .replace() makes sure that only . and not , is used, and trailing commas are removed */
    onAnswerGiven(value.replace(/,/g, '.').replace(/[.]\s*$/, ""));
  }

  return (
    <div className="flex flex-col m-lg:flex-row" >
      <label className="input mb-3 m-lg:mb-0 m-lg:mr-3 flex m-lg:w-1/3">
        <input autoFocus type="text" min="0" pattern="[0-9]+[.,]?[0-9]*" max="2147483647" size="7" className="flex-1" 
          value={value}
          onKeyPress = {(e) => onKeyPress(e)} 
          onChange={(e) => onChange(e)}
        />
        {isCarOption && <span className="ml-3">km</span>}
      </label>
      <AnswerButton 
        label="Next"
        onAnswerGiven={onAnswer}
        disableOnClick={!isCarOption}
        stylingClasses={"m-lg:w-2/3"}
      />
    </div>
  )
}

export default OptionNumerical;

