import React, { useState }  from 'react';
import AnswerButton from './AnswerButton.jsx';

const OptionNumerical = ({ onAnswerGiven, isCarOption }) => {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col m-lg:flex-row" >
      <label className="input mb-3 m-lg:mb-0 m-lg:mr-3 flex">
        <input key={isCarOption ? "car" : "flight"} autoFocus type="text" min="0" pattern="[0-9]+[.,]?[0-9]*" max="2147483647" size="7" className="flex-1" value={value} 
          onChange={(e) => {
            if(e.target.validity.valid)
              setValue(e.target.value);
          }}/>
        {isCarOption ? <span className="ml-3">km</span> : <></>}
      </label>
      <AnswerButton labelText="Next"
        onAnswerGiven={() => {
          setValue("");
          onAnswerGiven(value.replace(/[,.]\s*$/, ""));
        }}
      />
    </div>
  )
}

export default OptionNumerical;
