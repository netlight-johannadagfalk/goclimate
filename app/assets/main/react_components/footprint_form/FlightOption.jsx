import React, { useState }  from 'react';
import AnswerButton from './AnswerButton.jsx';

const FlightOption = ({ onAnswerGiven, option }) => {
  const [value, setValue] = useState(-1);

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

/*
        <AnswerButton key="w" onAnswerGiven= {onAnswerGiven()} />      






<input type="number" name="car_distance_week_answer" id="car_distance_week_answer" value="" min="0" max="2147483647" size="7" class="flex-1">
<span class="ml-3">km</span>
</label>
    <div className="flex flex-col m-lg:flex-row" onClick={() => onAnswerGiven("totes")}>
      <input type="number" min="0" max="2147483647" size="7" className="flex-1"/>
    </div>*/