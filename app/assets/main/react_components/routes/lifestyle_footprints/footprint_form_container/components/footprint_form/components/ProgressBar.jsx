import React from 'react';
import { useSession } from '../../../../contexts/SessionContext';

const ProgressBar = ({ questionCategories, currentObject }) => {
  const { signedInUser } = useSession();

  const categories = [
    'home',
    'utensils',
    'shopping-bag',
    'car',
    'plane',
    'chart-bar',
    ...(!signedInUser ? ['award'] : [])
  ];
  const inactiveCategoryClass = 'border-gray-tint-2';
  const activeCategoryClass =
    'border-green-tint-1 bg-green-tint-1 text-primary';
  let isCompletedCategory = true;

  return (
    <>
      <div className="flex justify-center space-x-3 m-lg:space-x-6 text-gray-shade-2 mt-3 t:mt-0">
        {categories.map((category) => {
          const currentQuestions = Object.keys(questionCategories).filter(
            (question) => questionCategories[question] == category
          );
          let currentClass = inactiveCategoryClass;
          if (currentObject.category == category) {
            currentClass = activeCategoryClass;
            isCompletedCategory = false;
          }
          return (
            <div key={category} className="space-y-2">
              <div>
                <div
                  className={
                    'rounded-full w-3 h-3 m-xxs:w-5 m-xxs:h-5 m-xs:w-8 m-xs:h-8 m-s:w-12 m-s:h-12 flex justify-center items-center box-content p-1 border ' +
                    currentClass
                  }
                >
                  <div
                    className={
                      'fas text-base m-xxs:text-sm m-s:text-lg fa-' + category
                    }
                  ></div>
                </div>
              </div>
              {
                <div className="flex justify-center space-x-1 text-gray-shade-2 content-between w-0 h-0 m-xs:w-full m-xs:h-auto text-gray-accent block">
                  {isCompletedCategory ? (
                    <div className="text-green-accent invisible m-xs:visible block">
                      <i className="text-base fa fa-check-circle"></i>
                    </div>
                  ) : (
                    currentQuestions.map((question, questionIndex) =>
                      questionIndex <=
                      currentQuestions.indexOf(currentObject.questionKey) ? (
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
