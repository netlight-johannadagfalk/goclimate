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
      <div className='flex justify-center space-x-3 m-lg:space-x-6 text-gray-shade-2'>
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
                  'rounded-full w-12 h-12 flex justify-center items-center box-content p-1 mb-2 border ' +
                  currentClass
                }
              >
                <div className={'fas fa-lg ' + 'fa-' + category}></div>
              </div>
              {
                <div className='flex justify-center space-x-1 text-gray-shade-2 content-between text-sm text-gray-accent block'>
                  {isCompletedCategory ? (
                    <div className='text-green-accent block'>
                      <i className='text-base fa fa-check-circle'></i>
                    </div>
                  ) : (
                    Object.keys(questionCategories)
                      .filter(
                        (question) => questionCategories[question] == category
                      )
                      .map((question) =>
                        question == currentObject.questionKey ? (
                          <i
                            key={question}
                            className={
                              'fa-circle text-sm block fas text-green-accent'
                            }
                          />
                        ) : (
                          <i
                            key={question}
                            className={
                              'fa-circle text-sm block far text-gray-accent'
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
