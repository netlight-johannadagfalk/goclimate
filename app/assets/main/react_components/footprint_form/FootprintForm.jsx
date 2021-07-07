import React, { useState, useEffect } from 'react';
import OptionList from './OptionList.jsx';
import OptionNumerical from './OptionNumerical.jsx';
import Title from './Title.jsx';

/**
 * FootprintForm has the responsibility to handle the logic for showing the the questions and answers 
 * in the form as well as show the current question on the form-page, one at the time. 
 * It also has the responsibility to store the answeres filled in by the user by changing the footprint object.
 */
const FootprintForm = ({ calculator, questions, options, footprint }) => {

  const order = ["region", "home", "home_area", "heating", "green_electricity", "food", "shopping", "car_type", "car_distance", "flight_hours"]
  const isNumerical = ["car_distance", "flight_hours"]
  const firstQuestionKey = getNextQuestionKey()

  const [currentQuestion, setCurrentQuestion] = useState(questions[firstQuestionKey]);
  const [currentOptions, setCurrentOptions] = useState(getOptions(firstQuestionKey));
  
  let indexOfCurrent = -1;

  function getNextQuestionKey(currentQuestionKey = null){
    if(!currentQuestionKey)
      return order.find((category) => calculator[category.concat("_options")])
    return currentQuestionKey
  }

  /** 
   * Is to filter out what options that should be used for the specific question, based on the calculator specifications
   * Returns a [key, value] pair list with all options to use
   */
   function getOptions(questionKey){
    const optionsToUse = Object.entries(options[questionKey]).filter(([key]) => {
      return findIfOptionIsUsed(questionKey, key);
    });
    return optionsToUse;
  }

  /** 
   * Is to find if a question option key exists in calculator. 
   * If found, it is valid and should be used should be used for the specific question, based on the calculator specifications
   */
  function findIfOptionIsUsed(questionKey, optionKey){
    const calculatorKeyForOptions = questionKey.concat("_options")
    return Object.values(calculator[calculatorKeyForOptions]).find((calculatorOptionKey) => {
      return calculatorOptionKey.key === optionKey;
    });
  }

  const onAnswerGiven = (givenAnswer) => {
    indexOfCurrent = order.indexOf(Object.keys(questions).find((key) => questions[key] == currentQuestion));
    saveAnswer(givenAnswer);
    toNextQuestion(givenAnswer);
  }

  const onAnswerGivenNumerical = (givenAnswer) => {
    // TODO: Handle numerical answer
  }

  const toNextQuestion = (givenAnswer) => {
    // TODO: Remake while-loop to check numerical question
    if(isNumerical.includes(order[indexOfCurrent+1])){
    } else {
      while(!calculator[(order[indexOfCurrent+1]).concat("_options")]){
        indexOfCurrent++;
      }
      setCurrentQuestion(questions[order[indexOfCurrent+1]]);
      const h = Object.entries(options[order[indexOfCurrent+1]]).filter(([key, v]) => {
        return Object.keys(calculator[order[indexOfCurrent+1].concat("_options")]).find((c) => {
          return calculator[order[indexOfCurrent+1].concat("_options")][c].key === key
        })
      })
      setCurrentOptions(h);
    }
  }

  const saveAnswer = (givenAnswer) => {
    footprint[order[indexOfCurrent]] = givenAnswer
  }

  return (
      <form action="/calculator" acceptCharset="UTF-8" method="post">
        <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
          <Title text={currentQuestion}/>
          <OptionList onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} options={currentOptions}/>
          <OptionNumerical option={{"key": "car_distance_answer", "value": "Next"}} onAnswerGiven={(givenAnswer) => onAnswerGivenNumerical(givenAnswer)} />
        </div>
      </form>
  )
}

export default FootprintForm;
