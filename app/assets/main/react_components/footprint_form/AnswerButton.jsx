import React from 'react';

const AnswerButton = (props) => {
  return (
    <div className="my-3" onClick={props.nextQuestion}>
        <input required="required" className="toggler" type="radio"/>
        <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_home_area_answer_fifteen_sqm">{props.alternative[1]}</label>
        <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_home_area_answer_fifteen_sqm">{props.alternative[1]}</label>
    </div>
  )
}

export default AnswerButton;

