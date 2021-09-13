import React from 'react';

/** Component that contains the progress bar that shows progress while answering the form
 * Each question in questionCategories has a category to show as active, these correspond to the alternatives in categories
 * Dots under each category is taken from each question in questionCategories, originally from footprintform
 */
const ProgressBar = ({ questionCategories, currentObject }) => {
  const categories = [
    'home',
    'utensils',
    'shopping-bag',
    'car',
    'plane',
    'chart-bar',
  ];
  const inactiveCategoryClass = 'border-gray-tint-2';
  const activeCategoryClass =
    'border-green-tint-1 bg-green-tint-1 text-primary';
  const greenDotClass = 'fas text-green-accent';
  const grayDotClass = 'far text-gray-accent';
  let currentClass = '';
  let isCompletedCategory = true;

  return (
    <>
      <div className="flex justify-center space-x-3 m-lg:space-x-6 text-gray-shade-2">
        {categories.map((category) => {
          currentObject.category == category
            ? (currentClass = activeCategoryClass)
            : (currentClass = inactiveCategoryClass);
          if (currentObject.category == category) isCompletedCategory = false;
          return (
            <div key={category}>
              <div
                className={
                  'rounded-full w-12 h-12 flex justify-center items-center box-content p-1 mb-2 border ' +
                  currentClass
                }
              >
                <div className={'fas fa-lg ' + 'fa-' + category}></div>
              </div>
              {
                <div className="flex justify-center space-x-1 text-gray-shade-2 content-between text-sm text-gray-accent block">
                  {isCompletedCategory && (
                    <div className="text-green-accent block">
                      <i className="text-base fa fa-check-circle"></i>
                    </div>
                  )}
                  {Object.keys(questionCategories).map((question) => {
                    if (!isCompletedCategory) {
                      if (questionCategories[question] == category) {
                        if (question == currentObject.questionKey) {
                          return (
                            <i
                              key={question}
                              className={
                                'fa-circle text-sm block ' + greenDotClass
                              }
                            />
                          );
                        } else {
                          return (
                            <i
                              key={question}
                              className={
                                'fa-circle text-sm block ' + grayDotClass
                              }
                            />
                          );
                        }
                      }
                    }
                  })}
                </div>
              }
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProgressBar;
