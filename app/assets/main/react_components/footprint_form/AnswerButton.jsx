import React from 'react';

const AnswerButton = (props) => {
  return (
    <div className="my-3" onClick={props.nextQuestion}>
        <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="fifteen_sqm" name="lifestyle_footprint[home_area_answer]" id="lifestyle_footprint_home_area_answer_fifteen_sqm"/>
        <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_home_area_answer_fifteen_sqm">{props.alternative}</label>
        <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_home_area_answer_fifteen_sqm">{props.alternative}</label>
    </div>
  )
}

export default AnswerButton;
