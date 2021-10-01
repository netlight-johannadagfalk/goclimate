import React, { useEffect, useRef, useState } from 'react';
import { useSession } from '../../../contexts/SessionContext.js';
import { useTexts } from '../../../contexts/TextsContext.js';
import constructQuestionObjects from '../../../helpers/constructQuestionObjects.js';
import {
  numericalKeys,
  resultKeys,
  resultObjects
} from '../../../helpers/footprint-data.js';
import BackButton from './components/BackButton.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import QuestionPage from './components/question_page/QuestionPage.jsx';
import ResultPage from './components/result_page/ResultPage.jsx';
import SignUpPage from './components/sign_up_page/SignUpPage.jsx';
import {
  submitFootprintForm,
  areObjectsEqual,
  getSessionStorage,
  getUsedQuestions,
  getSavedAnswer,
  goBack
} from './helpers/footprint-form-helper.js';

const FootprintForm = ({
  calculator,
  footprint,
  onChangeInformationSection
}) => {
  const questionCategories = {
    region: 'home',
    home: 'home',
    home_area: 'home',
    heating: 'home',
    green_electricity: 'home',
    food: 'utensils',
    shopping: 'shopping-bag',
    car_type: 'car',
    car_distance: 'car',
    flight_hours: 'plane',
    result_page_1: 'chart-bar',
    result_page_2: 'chart-bar',
    sign_up_page_1: 'award',
    sign_up_page_2: 'award'
  };

  const questionObjects = constructQuestionObjects(
    calculator,
    questionCategories,
    useTexts()
  );
  
  const URL = useSession().slug + '/calculator';
  const [result, setResult] = useState(undefined);
  const [currentObject, setCurrentObject] = useState(questionObjects[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mounted = useRef(false);

  const setAnswer = (givenAnswer) => {
    footprint[
      currentObject.questionKey === 'car_distance'
        ? currentObject.questionKey.concat('_week_answer')
        : currentObject.questionKey.concat('_answer')
    ] = givenAnswer;
    let nextQuestionIndex = currentIndex + 1;
    if (!questionObjects[nextQuestionIndex]) {
      if (
        !result ||
        (result && !areObjectsEqual(footprint, getSessionStorage('footprint')))
      ) {
        submitFootprintForm(
          result,
          footprint,
          mounted,
          setResult,
          setCurrentObject,
          resultObjects,
          URL
        );
        sessionStorage.setItem('footprint', JSON.stringify(footprint));
      } else {
        setCurrentObject(resultObjects[0]);
      }
    } else {
      if (givenAnswer === 'no_car') {
        nextQuestionIndex++;
        delete questionCategories['car_distance'];
      }
      setCurrentObject(questionObjects[nextQuestionIndex]);
    }
    setCurrentIndex(nextQuestionIndex);
  };

  useEffect(() => {
    onChangeInformationSection(
      currentIndex > questionObjects.length + 1 ? true : false
    );
  }, [currentIndex]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <>
      <div className="question pb-8">
        <ProgressBar
          questionCategories={getUsedQuestions(
            questionCategories,
            calculator,
            numericalKeys,
            resultKeys
          )}
          currentObject={currentObject}
        />
        {currentIndex < questionObjects.length ? (
          <QuestionPage
            currentObject={currentObject}
            onAnswerGiven={(givenAnswer) => setAnswer(givenAnswer)}
            selectedKey={footprint[currentObject.questionKey.concat('_answer')]}
            onNumericalInput={(givenAnswer) =>
              (footprint[
                currentObject.questionKey === 'car_distance'
                  ? currentObject.questionKey.concat('_week_answer')
                  : currentObject.questionKey.concat('_answer')
              ] = givenAnswer)
            }
            savedValue={getSavedAnswer(currentObject, footprint)}
          />
        ) : (
          result &&
          (currentIndex - questionObjects.length < 2 ? (
            <ResultPage
              result={result}
              page={currentIndex - questionObjects.length}
              onPageChange={() => {
                setCurrentObject(
                  resultObjects[currentIndex + 1 - questionObjects.length]
                );
                setCurrentIndex(currentIndex + 1);
              }}
            />
          ) : (
            <SignUpPage
              result={result}
              page={currentIndex - questionObjects.length}
              onPageChange={() => {
                setCurrentObject(
                  resultObjects[currentIndex + 1 - questionObjects.length]
                );
                setCurrentIndex(currentIndex + 1);
              }}
            />
          ))
        )}
      </div>
      {currentIndex > 0 && (
        <BackButton
          onClick={() =>
            goBack(
              currentIndex,
              questionObjects,
              footprint,
              setCurrentObject,
              resultObjects,
              setCurrentIndex
            )
          }
        />
      )}
      <div id="information-scroll-position"></div>
    </>
  );
};

export default FootprintForm;
