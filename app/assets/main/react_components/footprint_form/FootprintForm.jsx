import React, { useState } from 'react';
import OptionList from './OptionList.jsx';
import Title from './Title.jsx';
import OptionNumerical from './OptionNumerical.jsx';

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
   * Is to find if a question option key exists in calculator. 
   * If found, it is valid and should be used for the specific question, based on the calculator specifications
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
          "isCarOption": true
        };
      }
      return {
        "isNumerical": true,
        "isCarOption": false
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
    setCurrentOptions(getOptions(order[questionIndex]));
  }

  /**
   * When an answer is given to a question, save result and increase the index
   */
  function onAnswerGiven(givenAnswer){
    saveAnswer(givenAnswer);
    //if last question
    if(questionIndex == -1){
      submit();
    } else {
      if (order[questionIndex-1] === "car_type" && givenAnswer === "no_car" ){
        saveAnswer("");
        increaseIndex();
      }
      setQuestion();
    }
  }

  /**
   * Cleans upp an object and remocves all entities where value is "null" or "undefined".
   * Used for cleaning up the footprint object.
   */
  function removeNullAttributes(obj){
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj
  }  

  /**
   * Submits the completed form and sends a post request to the server
   * with the cleanFootprint object containing the answers.
   * After completed post request the user gets redirected to the result/sign-up page.
   */
  function submit(){
    var cleanFootprint = removeNullAttributes(footprint)
    cleanFootprint.country = cleanFootprint.country.country_data_or_code;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const URL = "/calculator";
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: {
          "X-CSRF-Token": csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanFootprint)
      };
      fetch(URL, requestOptions)
      .then(res => window.location.href = res.url)
  }

  /**
   * Saves the answer given
   * Does some checks and saves to the footprint object 
   */
  function saveAnswer(givenAnswer) {
    if (order[questionIndex] === "car_distance"){
      footprint[order[questionIndex].concat("_week_answer")] = givenAnswer
    } else {
      footprint[order[questionIndex].concat("_answer")] = givenAnswer
    }
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
    saveAnswer(givenAnswer);
    increaseIndex();
    if(questionIndex == -1){
      submit();
    } else {
      if (order[questionIndex-1] === "car_type" && givenAnswer === "no_car" ){
        saveAnswer("");
      }
      setQuestion();
    }
  }

  /**
   * Called on go back-button, loads the previous question by decreasing index and setting the question and options
   */
  function onGoBack(){
    decreaseIndex()
    setQuestion()
  }

  return (
      <form action="/calculator" acceptCharset="UTF-8" method="post" onSubmit={e => { e.preventDefault(); }}>
        <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
          <Title text={currentQuestion}/>
          {
            !currentOptions.isNumerical ? 
              <OptionList selectedKey={footprint[order[questionIndex].concat("_answer")]} onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} options={currentOptions.options}/>
            :
              <OptionNumerical onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} isCarOption={currentOptions.isCarOption}/>
          }
        </div>
        { questionIndex != firstQuestionIndex ? 
          <div className="flex justify-space-between">
            <div className="block">
              <i className="fas fa-chevron-left cursor-pointer" aria-hidden="true"></i>     
              <label className="px-1 cursor-pointer" onClick={onGoBack}>Go back</label>
            </div>
          </div>
          :
          <div/>
        }
      </form>
  )
}

export default FootprintForm;
