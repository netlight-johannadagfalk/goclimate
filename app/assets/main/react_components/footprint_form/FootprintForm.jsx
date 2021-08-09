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
  const numericalKeys = ["car_distance", "flight_hours"]
  const firstQuestionKey = order.find((category) => calculator[category.concat("_options")]);
  const firstQuestionIndex = order.indexOf((firstQuestionKey));
  const [currentQuestion, setCurrentQuestion] = useState(questions[firstQuestionKey]);
  const [currentOptions, setCurrentOptions] = useState(getOptions(firstQuestionKey));
  let questionIndex = order.indexOf(Object.keys(questions).find((key) => questions[key] == currentQuestion));

  /** 
   * Finds if a question option key exists in calculator. 
   */
  function isOptionUsed(questionKey, optionKey){
    const calculatorKeyForOptions = questionKey.concat("_options")
    return Object.values(calculator[calculatorKeyForOptions]).find((calculatorOptionKey) => {
      return calculatorOptionKey.key === optionKey;
    });
  }
  
  /** 
   * Filters out what options that should be used for the specific question, based on the calculator specifications
   * Returns a [key, value] pair list with all options to use
   */
  function getOptions(questionKey){
    if(numericalKeys.includes(questionKey)){
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
        return isOptionUsed(questionKey, key);
      });
      return {
        "options": optionsToUse,
        "isNumerical": false
      }
    }
  }

  function setQuestion(){
    setCurrentQuestion(questions[order[questionIndex]]);
    setCurrentOptions(getOptions(order[questionIndex]))
  }

  /**
   * Sets the index for next question
   * Increases with at least 1, but if next question is not to be used, the index increases again
   */
  function increaseIndex(){
    if(order[questionIndex] == "flight_hours"){
      questionIndex = -1;
    }
    else {
      do{
        questionIndex++;
      } while(calculator[(order[questionIndex]).concat("_options")] !== undefined 
        && !calculator[(order[questionIndex]).concat("_options")]);    
      }
  }
  
  /** 
  * Called when changing to a previous question, decreases the index, if question is undefined decrease again
  */
  function decreaseIndex(){
    if(questionIndex == 0){
      questionIndex = 0;
    }
    else {
      do{
        questionIndex--;
      } while(calculator[(order[questionIndex]).concat("_options")] !== undefined 
      && !calculator[(order[questionIndex]).concat("_options")]);    
    }
  }

  /**
   * Called when the answer to a question is given, saves the result and loads the next question
   */
  function onAnswerGiven(givenAnswer){
    //Save the given answer to the footprint object
    footprint[order[questionIndex].concat("_answer")] = givenAnswer
    increaseIndex();
    if(questionIndex == -1){
      submit();
    } else {
      setQuestion();
    }
  }

  /**
   * Called on go back-button, loads the previous question by decreasing index and setting the question and options
   */
  function onGoBack(){
    decreaseIndex()
    setQuestion()
    //TODO test with american (?) object where you step back twice
  }

  /**
   * Called on submission of the form, cleans nulls and submits post TODO explain further
   */
  function submit(){
    var cleanFootprint = cleanUpObjectWhereNull(footprint)
  }

  return (
      <form action="/calculator" acceptCharset="UTF-8" method="post">
        <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
          <Title text={currentQuestion}/>
          {
            !currentOptions.isNumerical ? 
              <OptionList selectedKey={footprint[order[questionIndex].concat("_answer")]} onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} options={currentOptions.options}/>
            :
              currentOptions.isCarOption ?
                <CarOption option={{"key": "car_distance_answer", "value": "Next"}} onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} />
              :
                <FlightOption option={{"key": "car_distance_answer", "value": "Next"}} onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} />
          }
        </div>
        { questionIndex != firstQuestionIndex ? 
          <div className="flex justify-space-between">
            <div className="block cursor-pointer">
              <i className="fas fa-chevron-left" aria-hidden="true"></i>     
              <label className="px-1" onClick={onGoBack}>Go back</label>
            </div>
          </div>
          :
          <div/>
        }
      </form>
  )
}

export default FootprintForm;
