import React from 'react';

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

  let isCompletedCategory = true;

  return (
    <>
      <div className="flex justify-center space-x-3 m-lg:space-x-6 text-gray-shade-2">
        {categories.map((category) => {
          let currentClass = inactiveCategoryClass;
          if (currentObject.category == category) {
            currentClass = activeCategoryClass;
            isCompletedCategory = false;
          }
          return (
            <div key={category}>
              <div
                className={
                  'rounded-full w-3 h-3 m-xxs:w-5 m-xxs:h-5 m-xs:w-8 m-xs:h-8 m-s:w-12 m-s:h-12 flex justify-center items-center box-content p-1 mb-2 border ' +
                  currentClass
                }
              >
                <div
                  className={
                    'fas text-base m-xxs:text-sm m-s:text-lg fa-' + category
                  }
                ></div>
              </div>
              {
                <div className="flex justify-center space-x-1 text-gray-shade-2 content-between w-0 h-0 m-xs:w-full m-xs:h-full  text-gray-accent block">
                  {isCompletedCategory ? (
                    <div className="text-green-accent invisible m-xs:visible block">
                      <i className="text-base fa fa-check-circle"></i>
                    </div>
                  ) : (
                    Object.keys(questionCategories)
                      .filter(
                        (question) => questionCategories[question] == category
                      )
                      .map((question) =>
                        question == currentObject.questionKey ? (
                          <div
                            key={question}
                            className={
                              'fa-circle invisible m-xs:visible text-sm block fas text-green-accent'
                            }
                          />
                        ) : (
                          <div
                            key={question}
                            className={
                              'fa-circle invisible m-xs:visible text-sm block far text-gray-accent'
                            }
                          />
                        )
                      )
                  )}
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
