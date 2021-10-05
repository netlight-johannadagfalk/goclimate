const cleanFootprint = (footprint) => {
  let cleanedFootprint = { ...footprint };
  cleanedFootprint = Object.fromEntries(
    Object.entries(cleanedFootprint).filter(
      (footprintField) => footprintField[1] !== null
    )
  );
  cleanedFootprint.country = cleanedFootprint.country.country_data_or_code;
  return cleanedFootprint;
};

const submitFootprintForm = (
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
        response.json().then((calculatedFootprint) => {
          setResult(calculatedFootprint);
          setCurrentObject(resultObjects[0]);
        });
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
  let filteredQuestionCategories = { ...questionCategories };
  filteredQuestionCategories = Object.fromEntries(
    Object.entries(filteredQuestionCategories).filter(
      ([categoryKey]) =>
        isQuestionUsed(categoryKey, calculator) ||
        numericalKeys.includes(categoryKey) ||
        resultKeys.includes(categoryKey)
    )
  );
  return filteredQuestionCategories;
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
  submitFootprintForm,
  areObjectsEqual,
  getSessionStorage,
  getUsedQuestions,
  getSavedAnswer,
  goBack
};
