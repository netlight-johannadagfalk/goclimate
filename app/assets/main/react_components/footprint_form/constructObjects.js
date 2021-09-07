/**
 * Creates list of objects for all questions used in the footprint form
 * Includes the question text, what options to use, its category, and type
 */
function constructObjects(calculator, categories, texts){
  const questionKeys = Object.keys(categories)
  let constructedQuestionObjects = questionKeys.filter(questionKey => calculator[questionKey.concat("_options")]).map((usedQuestionKey) => {
    const filteredOptions = Object.fromEntries(Object.entries(texts.lifestyleFootprintsText.options[usedQuestionKey]).filter(([optionKey]) => {
      return Object.values(calculator[usedQuestionKey.concat("_options")]).find((calculatorOptionKey) => calculatorOptionKey.key === optionKey)
    }))
    return {
      questionKey: usedQuestionKey,
      question: texts.lifestyleFootprintsText.questions[usedQuestionKey],
      options: filteredOptions,
      category: categories[usedQuestionKey],
      isNumerical: false
    }
  })
  let carObject = {
      questionKey: "car_distance",
      question: texts.lifestyleFootprintsText.questions["car_distance"],
      category: categories["car_distance"],
      text: texts.lifestyleFootprintsText.next,
      isNumerical: true,
      isCarOption: true
  }
  let flightObject = {
      questionKey: "flight_hours",
      question: texts.lifestyleFootprintsText.questions["flight_hours"],
      category: categories["flight_hours"],
      text: texts.lifestyleFootprintsText.title,
      isNumerical: true,
      isCarOption: false
    }
  constructedQuestionObjects.push(carObject, flightObject) 
  return constructedQuestionObjects
}

export default constructObjects;
