import React, { useState, useEffect } from 'react';
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
  const isNumerical = ["car_distance", "flight_hours"]
  const firstQuestionKey = order.find((category) => calculator[category.concat("_options")]);
  const [currentQuestion, setCurrentQuestion] = useState(questions[firstQuestionKey]);
  const [currentOptions, setCurrentOptions] = useState(getOptions(firstQuestionKey));
  let indexOfCurrent = order.indexOf(Object.keys(questions).find((key) => questions[key] == currentQuestion));

  /** 
   * Is to filter out what options that should be used for the specific question, based on the calculator specifications
   * Returns a [key, value] pair list with all options to use
   */
  function getOptions(questionKey){
    if(isNumerical.includes(questionKey)){
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
    if(indexOfCurrent == -1){
      submit();
    } else {
      if (order[indexOfCurrent-1] === "car_type" && givenAnswer === "no_car" ){
        saveAnswer("");
        indexOfCurrent++;
      }
      setNextQuestion();
      setNextOptions();
    }
  }

  /**
   * Submits the completed form and sends a post request to the server
   * with the cleanFootprint object containing the answers.
   * After completed post request the user gets redirected to the result/sign-up page.
  */
  const submit = () => {
    var cleanFootprint = cleanUpObjectWhereNull(footprint)
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
  
  const saveAnswer = (givenAnswer) => {
    if (order[indexOfCurrent] === "car_distance"){
      footprint[order[indexOfCurrent].concat("_week_answer")] = givenAnswer
    } else {
      footprint[order[indexOfCurrent].concat("_answer")] = givenAnswer
    }
  }

  /**
   * Sets the index for next question
   * Increases with at least 1, but if next question is not to be used, the index increases again
   */
  const setNewCurrentIndex = () => {
    if(order[indexOfCurrent] == "flight_hours"){
      indexOfCurrent = -1;
    }
    else {
      do{
        indexOfCurrent++;
      } while(calculator[(order[indexOfCurrent]).concat("_options")] !== undefined && !calculator[(order[indexOfCurrent]).concat("_options")]);    
      }
  }

  const setNextQuestion = () => {
    setCurrentQuestion(questions[order[indexOfCurrent]]);
  }

  const setNextOptions = () => {
    setCurrentOptions(getOptions(order[indexOfCurrent]))
  }

  /**
   * Cleans upp an object and remocves all entities where value is "null" or "undefined".
   * Used for cleaning up the footprint object.
   */
  const cleanUpObjectWhereNull = (obj) => {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj
  }

  return (
      <form action="/calculator" acceptCharset="UTF-8" method="post" onSubmit={e => { e.preventDefault(); }}>
        <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
          <Title text={currentQuestion}/>
          {
            !currentOptions.isNumerical ? 
              <OptionList onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} options={currentOptions.options}/>
            :
              <OptionNumerical onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} isCarOption={currentOptions.isCarOption}/>
          }
        </div>
      </form>
  )
}

export default FootprintForm;
