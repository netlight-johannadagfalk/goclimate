const cleanFootprint = (footprint) => {
  const cleanedFootprint = { ...footprint };
  for (var footprintField in cleanedFootprint) {
    if (!cleanedFootprint[footprintField]) {
      delete cleanedFootprint[footprintField];
    }
  }
  cleanedFootprint.country = cleanedFootprint.country.country_data_or_code;
  return cleanedFootprint;
};

const submitFootprintForm = (
  result,
  footprint,
  mounted,
  setResult,
  setCurrentObject,
  resultObjects,
  URL
) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const requestOptions = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cleanFootprint(footprint))
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

const isQuestionUsed = (questionKey, calculator) => {
  const calculatorKeyForOptions = questionKey.concat('_options');
  return calculator[calculatorKeyForOptions] != null;
};

const getUsedQuestions = (
  questionCategories,
  calculator,
  numericalKeys,
  resultKeys
) => {
  const tempQuestionCategories = { ...questionCategories };
  for (const question in tempQuestionCategories) {
    if (
      !isQuestionUsed(question, calculator) &&
      !numericalKeys.includes(question) &&
      !resultKeys.includes(question)
    ) {
      delete tempQuestionCategories[question];
    }
  }
  return tempQuestionCategories;
};

const getSavedAnswer = (currentObject, footprint) => {
  const questionKey = currentObject.questionKey;
  if (questionKey === 'car_distance') {
    return footprint[questionKey.concat('_week_answer')] || '';
  }
  return footprint[questionKey.concat('_answer')] || '';
};

const goBack = (
  currentIndex,
  questionObjects,
  footprint,
  setCurrentObject,
  resultObjects,
  setCurrentIndex
) => {
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

export {
  cleanFootprint,
  submitFootprintForm,
  areObjectsEqual,
  getSessionStorage,
  isQuestionUsed,
  getUsedQuestions,
  getSavedAnswer,
  goBack
};
