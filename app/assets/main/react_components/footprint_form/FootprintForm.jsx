import React, { useState, useEffect } from 'react';
import OptionList from './OptionList.jsx';
import Title from './Title.jsx';

/**
 FootprintForm has the responsibility to handle the logic for showing the the questions and answers 
 in the form as well as show the current question on the form-page, one at the time. 
 It also has the responsibility to store the answeres filled in by the user by changing the footprint object.
 */
const FootprintForm = ({ calculator, questions, options, footprint }) => {

  const order = ["region", "home", "home_area", "heating", "green_electricity", "food", "shopping", "car_type", "car_distance", "flight_hours"]
  const firstQuestion = order.find((category) => calculator[category.concat("_options")])
  let indexOfCurrent = -1;

  const [currentQuestion, setCurrentQuestion] = useState(questions[firstQuestion]);
  const [currentOptions, setCurrentOptions] = useState(Object.entries(options[firstQuestion]).filter(([key, v]) => Object.keys(calculator[firstQuestion.concat("_options")]).find((c) => calculator[firstQuestion.concat("_options")][c].key === key)));

  const toNextQuestion = (givenAnswer) => {
    indexOfCurrent = order.indexOf(Object.keys(questions).find((key) => questions[key] == currentQuestion));
    saveAnswer(givenAnswer);
    while(!calculator[(order[indexOfCurrent+1]).concat("_options")]){
      indexOfCurrent++;
    }
    setCurrentQuestion(questions[order[indexOfCurrent+1]]);
    setCurrentOptions(Object.entries(options[order[indexOfCurrent+1]]).filter(([key, v]) => Object.keys(calculator[order[indexOfCurrent+1].concat("_options")]).find((c) => calculator[order[indexOfCurrent+1].concat("_options")][c].key === key)));
  }

  const saveAnswer = (givenAnswer) => {
    footprint[order[indexOfCurrent]] = givenAnswer
  }

  return (
      <form action="/calculator" acceptCharset="UTF-8" method="post">
        <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
          <Title text={currentQuestion}/>
          <OptionList toNextQuestion={(givenAnswer) => toNextQuestion(givenAnswer)} options={currentOptions}/>
        </div>
      </form>
  )
}

export default FootprintForm;
