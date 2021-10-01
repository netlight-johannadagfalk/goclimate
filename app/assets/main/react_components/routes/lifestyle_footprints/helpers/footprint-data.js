const numericalKeys = ['car_distance', 'flight_hours'];

const resultKeys = [
  'result_page_1',
  'result_page_2',
  'sign_up_page_1',
  'sign_up_page_2'
];

const resultCategories = ['chart-bar', 'chart-bar', 'award', 'award'];

var resultObjects = [];
for (var i = 0; i < resultKeys.length; i++) {
  resultObjects.push({
    questionKey: resultKeys[i],
    category: resultCategories[i]
  });
}

export { numericalKeys, resultKeys, resultObjects };
