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

  const [result, setResult] = useState();
  const [currentObject, setCurrentObject] = useState(questionObjects[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mounted = useRef(false);

  const cleanFootprint = (basicFootprint) => {
    for (var footprintField in basicFootprint) {
      if (
        basicFootprint[footprintField] === null ||
        basicFootprint[footprintField] === undefined
      ) {
        delete basicFootprint[footprintField];
      }
    }
    basicFootprint.country = basicFootprint.country.country_data_or_code;
    return basicFootprint;
  };

  const submitFootprintForm = () => {
    const answers = result ? footprint : cleanFootprint(footprint);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(answers)
    };
    fetch(URL, requestOptions)
      .then((response) => {
        if (mounted.current) {
          /* IF RESULT IN FORM: */
          response.json().then((calculatedFootprint) => {
            setResult(calculatedFootprint);
            setCurrentObject(resultObjects[0]);
          });
          /* IF RESULT ON RESULT PAGE: */
          // window.location.href = response.url
        }
      })
      .catch((error) => {
        console.log('Something went wrong, trying again.', error);
      });
  };

  const areObjectsEqual = (...objects) => {
    return objects.every(
      (obj) => JSON.stringify(obj) === JSON.stringify(objects[0])
    );
  };

  const getSessionStorage = (key) => {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : {};
  };

  const isQuestionUsed = (questionKey) => {
    const calculatorKeyForOptions = questionKey.concat('_options');
    return calculator[calculatorKeyForOptions] != null;
  };

  const getUsedQuestions = () => {
    for (const question in questionCategories) {
      if (
        !isQuestionUsed(question) &&
        !numericalKeys.includes(question) &&
        !resultKeys.includes(question)
      ) {
        delete questionCategories[question];
      }
    }
    return questionCategories;
  };

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
        submitFootprintForm();
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

  const getSavedAnswer = () => {
    const questionKey = currentObject.questionKey;
    if (questionKey === 'car_distance') {
      if (footprint[questionKey.concat('_week_answer')])
        return footprint[questionKey.concat('_week_answer')];
      return '';
    }
    if (footprint[questionKey.concat('_answer')])
      return footprint[questionKey.concat('_answer')];
    return '';
  };

  const goBack = () => {
    let newIndex = currentIndex - 1;
    if (
      newIndex < questionObjects.length &&
      questionObjects[newIndex].questionKey === 'car_distance' &&
      footprint['car_type_answer'] === 'no_car'
    )
      newIndex--;
    setCurrentObject(
      newIndex < questionObjects.length
        ? questionObjects[newIndex]
        : resultObjects[newIndex - questionObjects.length]
    );
    setCurrentIndex(newIndex);
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
          questionCategories={getUsedQuestions()}
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
            savedValue={getSavedAnswer()}
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
      {currentIndex > 0 && <BackButton onClick={goBack} />}
      <div id="information-scroll-position"></div>
    </>
  );
};

export default FootprintForm;
