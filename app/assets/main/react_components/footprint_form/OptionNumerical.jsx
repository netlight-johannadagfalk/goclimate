import React, { useState }  from 'react';
import AnswerButton from './AnswerButton.jsx';

const OptionNumerical = ({ onAnswerGiven, isCarOption }) => {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col m-lg:flex-row" >
      <label className="input mb-3 m-lg:mb-0 m-lg:mr-3 flex">
        <input autoFocus type="text" min="0" pattern="[0-9]+[.,]?[0-9]*" max="2147483647" size="7" className="flex-1" value={value} 
          onChange={(e) => {
            /* Checks if input is valid compared to set requirements */
            if(e.target.validity.valid)
              setValue(e.target.value);
          }}/>
        {isCarOption ? <span className="ml-3">km</span> : <></>}
      </label>
      <AnswerButton labelText="Next"
        onAnswerGiven={() => {
          setValue("");
          /* .replace() makes sure that trailing commas (, or .) are removed */
          onAnswerGiven(value.replace(/[,.]\s*$/, ""));
        }}
      />
    </div>
  )
}

export default OptionNumerical;
