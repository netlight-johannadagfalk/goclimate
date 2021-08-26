import React, { useState } from 'react';
import ProgressBar from './ProgressBar.jsx';
import ResultPage from './ResultPage.jsx';
import QuestionPage from './QuestionPage.jsx';

/**
 * FootprintForm has the responsibility to handle the logic for showing the the questions and answers 
 * in the form as well as show the current question on the form-page, one at the time. 
 * It also has the responsibility to store the answeres filled in by the user by changing the footprint object.
 */
const FootprintForm = ({ calculator, questionStrings, options, footprint, route, texts, lang }) => {
  //key value pairs where the key is each question in order and the value is the corresponding category
  const questionCategories = {"region": "home", "home": "home", "home_area": "home", "heating": "home", "green_electricity": "home", "food": "utensils", "shopping": "shopping-bag", "car_type": "car", "car_distance": "car", "flight_hours": "plane", "result-page-1": "chart-bar", "result-page-2": "chart-bar"};
  const questionKeys = Object.keys(questionCategories)
  const numericalKeys = ["car_distance", "flight_hours"]
  const resultKeys = ["result-page-1", "result-page-2"]
  const firstQuestionKey = questionKeys.find((question) => calculator[question.concat("_options")]);
  const firstQuestionIndex = questionKeys.indexOf((firstQuestionKey));

  const [currentQuestionString, setcurrentQuestionString] = useState(questionStrings[firstQuestionKey]);
  const [currentOptions, setCurrentOptions] = useState(getOptions(firstQuestionKey));
  const [result, setResult] = useState();
  const [currentIndex, setCurrentIndex] = useState(questionKeys.indexOf(Object.keys(questionStrings).find((key) => questionStrings[key] == questionStrings[firstQuestionKey])))
  
  function isQuestionUsed(questionKey){
    const calculatorKeyForOptions = questionKey.concat("_options")
    return calculator[calculatorKeyForOptions] != null
  }

  /**
   * Takes the questions from questionCategories and removes questions not used for the specified country
   */
  function removeIrrelevantQuestions(){
    for (const question in questionCategories){
        if(!isQuestionUsed(question) && !numericalKeys.includes(question) && !resultKeys.includes(question)){
          delete questionCategories[question]
        }
      }   
  }

  function setSessionStorage(key, data){
    sessionStorage.setItem(key, JSON.stringify(data))
  }

  function getSessionStorage(key){
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : {}
  }    

  function areObjectsEqual(...objects){
    return objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]));
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
          "isCarOption": true,
          "text": texts.lifestyleFootprintsText.next
        };
      }
      return {
        "isNumerical": true,
        "isCarOption": false,
        "text": texts.lifestyleFootprintsText.title
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
  function setQuestion(index){
    setcurrentQuestionString(questionStrings[questionKeys[index]]);
    setCurrentOptions(getOptions(questionKeys[index]));
  }

  /**
   * Cleans upp an object and remocves all entities where value is "null" or "undefined".
   * Used for cleaning up the footprint object.
   */
  function cleanFootprint(basicFootprint){
    for (var footprintField in basicFootprint) {
      if (basicFootprint[footprintField] === null || basicFootprint[footprintField] === undefined) {
        delete basicFootprint[footprintField];
      }
    }
    basicFootprint.country = basicFootprint.country.country_data_or_code;
    return basicFootprint
  } 

  /**
   * Submits the completed form and sends a post request to the server
   * with the cleanFootprint object containing the answers.
   * After completed post request the user gets redirected to the result/sign-up page.
   */
  function submit(){
    const answers = result ? footprint : cleanFootprint(footprint)
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const URL = route;
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: {
          "X-CSRF-Token": csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers)
      };
    fetch(URL, requestOptions)
      .then(response => {
        response.json().then(calculatedFootprint => {
          setResult(calculatedFootprint)
          increaseIndex()
        })
        //window.location.href = response.url
      })
      .catch(error => {
        console.log("Something went wrong, trying again.", error);
      })
  }

  /**
   * Saves the answer given
   * Does some checks and saves to the footprint object 
   */
  function saveAnswer(givenAnswer) {
    if (questionKeys[currentIndex] === "car_distance"){
      footprint[questionKeys[currentIndex].concat("_week_answer")] = givenAnswer
    } else {
      footprint[questionKeys[currentIndex].concat("_answer")] = givenAnswer
    }
  }

  /**
   * Sets the index for next question
   * Increases with at least 1, but if next question is not to be used, the index increases again
   */
  function increaseIndex(){
    let nextIndex = currentIndex
    do{
      nextIndex++;
    } while((calculator[(questionKeys[nextIndex]).concat("_options")] !== undefined 
      && !calculator[(questionKeys[nextIndex]).concat("_options")])
      && !resultKeys.includes(questionKeys[nextIndex]));    
    setCurrentIndex(nextIndex)
    return nextIndex
  }
  
  /** 
   * Called when changing to a previous question, decreases the index, if question is undefined decrease again
   */
  function decreaseIndex(){
    let nextIndex = currentIndex
    do{
      nextIndex--
    } while(calculator[(questionKeys[nextIndex]).concat("_options")] !== undefined 
    && !calculator[(questionKeys[nextIndex]).concat("_options")]);    
    setCurrentIndex(nextIndex)
    return nextIndex
  }

  /**
   * Called on go back-button, loads the previous question by decreasing index and setting the question and options
   */
  function onGoBack(){
    let previousQuestionIndex = decreaseIndex()
    if(!resultKeys.includes(questionKeys[previousQuestionIndex]))
      setQuestion(previousQuestionIndex)
  }

  /**
   * Provides numerical input fields with default values
   * Returns actual value if back button has been used, meaning answer has been entered earlier
   */
  function getSavedValue(){
    const questionKey = questionKeys[currentIndex];
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
    let nextQuestionIndex = increaseIndex();
    if(questionKeys[nextQuestionIndex] === "result-page-1"){
      if(!result || result && !areObjectsEqual(footprint, getSessionStorage('footprint'))){
        submit()
        setSessionStorage('footprint', footprint)
      }
       
    } else {
      if (questionKeys[nextQuestionIndex-1] === "car_type" && givenAnswer === "no_car"){
        saveAnswer("");
        nextQuestionIndex = increaseIndex();
        delete questionCategories["car_distance"]      
      }
      setQuestion(nextQuestionIndex);
    }
  }

  return (
    <>
        <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
          <ProgressBar 
            questionCategories={questionCategories} 
            calculator={calculator} 
            activeCategory={questionCategories[questionKeys[currentIndex]]} 
            activeQuestion={questionKeys[currentIndex]}
          />
          {result && resultKeys.includes(questionKeys[currentIndex]) ?
              <ResultPage 
                result={result} 
                texts={texts}
                lang={lang}
                page={resultKeys.indexOf(questionKeys[currentIndex])}
                onPageChange={increaseIndex}
              />
            :
            <QuestionPage
              question={currentQuestionString}
              onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)}
              options={currentOptions}
              selectedKey={footprint[questionKeys[currentIndex].concat("_answer")]}
              onNumericalInput={saveAnswer}
              savedValue={getSavedValue()}
            />
          }
        </div>
        { currentIndex != firstQuestionIndex &&
          <div className="flex justify-space-between">
            <div className="block">
              <i className="fas fa-chevron-left cursor-pointer" aria-hidden="true"></i>     
              <label className="px-1 cursor-pointer" onClick={onGoBack}>Go back</label>
            </div>
          </div>
        }
    </>
  )
}

export default FootprintForm;
