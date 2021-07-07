import React, { useState, useEffect } from 'react';
import OptionList from './OptionList.jsx';
import Title from './Title.jsx';
import CarOption from './CarOption.jsx';
import FlightOption from './FlightOption.jsx';

/**
 * FootprintForm has the responsibility to handle the logic for showing the the questions and answers 
 * in the form as well as show the current question on the form-page, one at the time. 
 * It also has the responsibility to store the answeres filled in by the user by changing the footprint object.
 */
const FootprintForm = ({ calculator, questions, options, footprint }) => {

  const order = ["region", "home", "home_area", "heating", "green_electricity", "food", "shopping", "car_type", "car_distance", "flight_hours"]
  const isNumerical = ["car_distance", "flight_hours"]
  const firstQuestionKey = order.find((category) => calculator[category.concat("_options")]);

  const [currentQuestion, setCurrentQuestion] = useState(questions[firstQuestionKey]);
  const [currentOptions, setCurrentOptions] = useState(getOptions(firstQuestionKey));

  console.log(footprint);
  
  let indexOfCurrent = order.indexOf(Object.keys(questions).find((key) => questions[key] == currentQuestion));

  /** 
   * Is to filter out what options that should be used for the specific question, based on the calculator specifications
   * Returns a [key, value] pair list with all options to use
   */
  function getOptions(questionKey){
    if(isNumerical.includes(questionKey)){
      console.log("numerical question", questionKey);
      if(questionKey === "car_distance"){
        return {
          "isNumerical": true,
          "isCarOption": true,
          "options": {
            "key": "car_distance_answer",
            "value": "car_distance"
          }
        };
      }
      return {
        "isNumerical": true,
        "isCarOption": false,
          "options": {
            "key": "flight_hours_answer",
            "value": "flight_hours"
          }
      }
    }
    else {
      const optionsToUse = Object.entries(options[questionKey]).filter(([key]) => {
        return findIfOptionIsUsed(questionKey, key);
      });
      return {
        "options": optionsToUse,
        "isNumerical": false
      }
    }
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
    saveAnswer(givenAnswer);
    setNewCurrentIndex();
    setNextQuestion();
    setNextOptions();
  }

  const saveAnswer = (givenAnswer) => {
    footprint[order[indexOfCurrent]] = givenAnswer
  }

  /**
   * Sets the index for next question
   * Increases with at least 1, but if next question is not to be used, the index increases again
   */
  const setNewCurrentIndex = () => {
    do{
      indexOfCurrent++;
    } while(calculator[(order[indexOfCurrent]).concat("_options")] !== undefined && !calculator[(order[indexOfCurrent]).concat("_options")]);    
  }

  const setNextQuestion = () => {
    setCurrentQuestion(questions[order[indexOfCurrent]]);
  }

  const setNextOptions = () => {
    setCurrentOptions(getOptions(order[indexOfCurrent]))
  }

  const onAnswerGivenNumerical = (givenAnswer) => {
    // TODO: Handle numerical answer
  }

  return (
      <form action="/calculator" acceptCharset="UTF-8" method="post">
        <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
          <Title text={currentQuestion}/>
          {
            !currentOptions.isNumerical ? 
              <OptionList onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} options={currentOptions.options}/>
            :
              currentOptions.isCarOption ?
                <CarOption option={{"key": "car_distance_answer", "value": "Next"}} onAnswerGiven={(givenAnswer) => onAnswerGivenNumerical(givenAnswer)} />
              :
                <FlightOption option={{"key": "car_distance_answer", "value": "Next"}} onAnswerGiven={(givenAnswer) => onAnswerGivenNumerical(givenAnswer)} />
              //<OptionNumerical option={{"key": "car_distance_answer", "value": "Next"}} onAnswerGiven={(givenAnswer) => onAnswerGivenNumerical(givenAnswer)} />
          }
        </div>
      </form>
  )
}

export default FootprintForm;
