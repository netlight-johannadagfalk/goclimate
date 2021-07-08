import React, { useState }  from 'react';
import AnswerButton from './AnswerButton.jsx';

const FlightOption = ({ onAnswerGiven, option }) => {
  const [value, setValue] = useState(0);

  return (
    <div className="flex flex-col m-lg:flex-row" >
      <label className="input mb-3 m-lg:mb-0 m-lg:mr-3 flex">
        <input type="number" min="0" pattern="[0-9]*" max="2147483647" size="7" className="flex-1" onChange={e => setValue(e.target.value)}/>
      </label>
      <AnswerButton onAnswerGiven={() => onAnswerGiven(value)} option={option}/>
    </div>
  )
}

export default FlightOption;
