import React, { useState } from 'react';
import OptionList from './OptionList.jsx';
import Title from './Title.jsx';
import OptionNumerical from './OptionNumerical.jsx';
import ProgressBar from './ProgressBar.jsx';

/**
 * FootprintForm has the responsibility to handle the logic for showing the the questions and answers 
 * in the form as well as show the current question on the form-page, one at the time. 
 * It also has the responsibility to store the answeres filled in by the user by changing the footprint object.
 */
const FootprintForm = ({ calculator, questionStrings, options, footprint }) => {

  const questionCategories = {"region": "home", "home": "home", "home_area": "home", "heating": "home", "green_electricity": "home", "food": "utensils", "shopping": "shopping-bag", "car_type": "car", "car_distance": "car", "flight_hours": "plane"};
  const questionKeys = Object.keys(questionCategories)
  const numericalKeys = ["car_distance", "flight_hours"]
  const firstQuestionKey = questionKeys.find((question) => calculator[question.concat("_options")]);
  const firstQuestionIndex = questionKeys.indexOf((firstQuestionKey));
  const [currentQuestionString, setcurrentQuestionString] = useState(questionStrings[firstQuestionKey]);
  const [currentOptions, setCurrentOptions] = useState(getOptions(firstQuestionKey));
  let questionIndex = questionKeys.indexOf(Object.keys(questionStrings).find((key) => questionStrings[key] == currentQuestionString));
  const [category, setCategory] = useState("home")


  function isQuestionUsed(questionKey){
    const calculatorKeyForOptions = questionKey.concat("_options")
    return !(calculator[calculatorKeyForOptions] == null)
  }

  /**
   * Takes the questions from questionCategories and removes questions not used for the specified country
   */
  function removeIrrelevantQuestions(){
      for (const question in questionCategories){
        if(!isQuestionUsed(question) && !numericalKeys.includes(question)){
          delete questionCategories[question]
        }
      }   
  }

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
    removeIrrelevantQuestions()
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

  /**
   * Sets question text, options to show and the current category
   */
  function setQuestion(){
    let key = questionKeys[questionIndex]
    setcurrentQuestionString(questionStrings[key]);
    setCurrentOptions(getOptions(key));
    setCategory(questionCategories[key])
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
    if (questionKeys[questionIndex] === "car_distance"){
      footprint[questionKeys[questionIndex].concat("_week_answer")] = givenAnswer
    } else {
      footprint[questionKeys[questionIndex].concat("_answer")] = givenAnswer
    }
  }

  /**
   * Sets the index for next question
   * Increases with at least 1, but if next question is not to be used, the index increases again
   */
  function increaseIndex(){
    if(questionKeys[questionIndex] == "flight_hours"){
      questionIndex = -1;
    }
    else {
      do{
        questionIndex++;
      } while(calculator[(questionKeys[questionIndex]).concat("_options")] !== undefined 
        && !calculator[(questionKeys[questionIndex]).concat("_options")]);    
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
      } while(calculator[(questionKeys[questionIndex]).concat("_options")] !== undefined 
      && !calculator[(questionKeys[questionIndex]).concat("_options")]);    
    }
  }

  /**
   * Called on go back-button, loads the previous question by decreasing index and setting the question and options
   */
  function onGoBack(){
    decreaseIndex()
    setQuestion()
  }

  /**
   * Provides numerical input fields with default values
   * Returns actual value if back button has been used, meaning answer has been entered earlier
   */
  function getSavedValue(){
    const questionKey = questionKeys[questionIndex];
    if(questionKey === "car_distance"){
      if(footprint[questionKey.concat("_week_answer")])
        return footprint[questionKey.concat("_week_answer")]
      return ""
    }
    if(footprint[questionKey.concat("_answer")])
      return footprint[questionKey.concat("_answer")]
    return ""
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
      if (questionKeys[questionIndex-1] === "car_type" && givenAnswer === "no_car" ){
        saveAnswer("");
        increaseIndex();
        delete questionCategories["car_distance"]      }
      setQuestion();
    }
  }

  return (
      <form action="/calculator" acceptCharset="UTF-8" method="post" onSubmit={e => { e.preventDefault(); }}>
        <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
          <ProgressBar 
            questionCategories={questionCategories} 
            calculator={calculator} 
            activeCategory={category} 
            activeQuestion={questionKeys[questionIndex]}/>
          <Title text={currentQuestionString}/>
          {
            !currentOptions.isNumerical ? 
              <OptionList 
                onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} 
                options={currentOptions.options}
                selectedKey={footprint[questionKeys[questionIndex].concat("_answer")]} 
              />
            :
              <OptionNumerical 
                onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)} 
                isCarOption={currentOptions.isCarOption} 
                onNumericalInput={saveAnswer}
                savedValue={getSavedValue()} 
              />
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
