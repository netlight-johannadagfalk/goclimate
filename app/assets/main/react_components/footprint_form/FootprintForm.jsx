import React, { useState, useMemo } from 'react';
import ProgressBar from './ProgressBar.jsx';
import ResultPage from './ResultPage.jsx';
import QuestionPage from './QuestionPage.jsx';
import constructObjects from './constructObjects.js';
import { numericalKeys, resultKeys, resultObjects } from './footprint-data.js';

/**
 * FootprintForm has the responsibility to handle the logic for showing the the questions and answers 
 * in the form as well as show the current question on the form-page, one at the time. 
 * It also has the responsibility to store the answeres filled in by the user by changing the footprint object.
 */
const FootprintForm = ({ calculator, questionStrings, options, footprint, URL, texts, lang }) => {
  //key value pairs where the key is each question in order and the value is the corresponding category
  const questionCategories = {"region": "home", "home": "home", "home_area": "home", "heating": "home", "green_electricity": "home", "food": "utensils", "shopping": "shopping-bag", "car_type": "car", "car_distance": "car", "flight_hours": "plane", "result-page-1": "chart-bar", "result-page-2": "chart-bar"};
  const questionObjects = useMemo(() => constructObjects(calculator, options, questionStrings, questionCategories, texts), []);
  
  const [result, setResult] = useState();
  const [currentObject, setCurrentObject] = useState(questionObjects[0]);
  const [currentIndex, setCurrentIndex] = useState(0)

  function isQuestionUsed(questionKey){
    const calculatorKeyForOptions = questionKey.concat("_options")
    return calculator[calculatorKeyForOptions] != null
  }

  /**
   * Takes the questions from questionCategories and removes questions not used for the specified country
   */
  function getUsedQuestions(){
    for (const question in questionCategories){
        if(!isQuestionUsed(question) && !numericalKeys.includes(question) && !resultKeys.includes(question)){
          delete questionCategories[question]
        }
      }   
    return questionCategories
  }

  function getSessionStorage(key){
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : {}
  }    

  function areObjectsEqual(...objects){
    return objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]));
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
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers)
      };
    fetch(URL, requestOptions)
      .then(response => {
        /* IF RESULT IN FORM: */
        response.json().then(calculatedFootprint => {
          setResult(calculatedFootprint)
          setCurrentObject(resultObjects[0])
        })
        /* IF RESULT ON RESULT PAGE: */
        // window.location.href = response.url
      })
      .catch(error => {
        console.log("Something went wrong, trying again.", error);
      })
  }

  /**
   * Called on go back-button, loads the previous question by decreasing index and setting the question and options
   */
  function onGoBack(){
    let newIndex = currentIndex - 1
    if(newIndex < questionObjects.length
      && questionObjects[newIndex].questionKey === "car_distance"
      && footprint["car_type_answer"] === "no_car")
      newIndex--
    setCurrentObject(newIndex < questionObjects.length ? questionObjects[newIndex] : resultObjects[newIndex - questionObjects.length])
    setCurrentIndex(newIndex)
  }

  /**
   * Provides numerical input fields with default values
   * Returns actual value if back button has been used, meaning answer has been entered earlier
   */
  function getSavedValue(){
    const questionKey = currentObject.questionKey;
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
    footprint[currentObject.questionKey === "car_distance" ? currentObject.questionKey.concat("_week_answer") : currentObject.questionKey.concat("_answer")] = givenAnswer
    let nextQuestionIndex = currentIndex + 1;
    if(!questionObjects[nextQuestionIndex]){
      if(!result || result && !areObjectsEqual(footprint, getSessionStorage('footprint'))){
        submit()
        sessionStorage.setItem('footprint', JSON.stringify(footprint))
      } else {
        setCurrentObject(resultObjects[0])
      }
    } else {
      if (givenAnswer === "no_car"){
        nextQuestionIndex++;
        delete questionCategories["car_distance"]      
      }
      setCurrentObject(questionObjects[nextQuestionIndex])
    }
    setCurrentIndex(nextQuestionIndex)
  }

  return (
    <> 
        <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
          <ProgressBar 
            questionCategories={getUsedQuestions()} 
            currentObject={currentObject}
          />
          {currentIndex < questionObjects.length ?
            <QuestionPage
              currentObject={currentObject}
              onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)}
              selectedKey={footprint[currentObject.questionKey.concat("_answer")]}
              onNumericalInput={(givenAnswer) => footprint[currentObject.questionKey === "car_distance" ? currentObject.questionKey.concat("_week_answer") : currentObject.questionKey.concat("_answer")] = givenAnswer}
              savedValue={getSavedValue()}
            />
            :
            result && <ResultPage 
              result={result} 
              texts={texts}
              lang={lang}
              page={currentIndex - questionObjects.length}
              onPageChange={() => {
                setCurrentObject(resultObjects[currentIndex + 1 - questionObjects.length])
                setCurrentIndex(currentIndex + 1)
              }}
            />            
          }
        </div>
        {currentIndex > 0 &&
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
