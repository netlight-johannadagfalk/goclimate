import React from 'react';

const ProgressBar = ({ categories, item, userActions, actions }) => {
  const categoriesWithMembershipAchievement = [
    ...categories,
    { id: '-1', name: 'Climate Friend' }
  ];
  const getCategoryName = (categories) => {
    for (let i = 0; i <= Object.keys(categories).length - 1; i++) {
      if (categories[i].id == item.id) {
        return categories[i].name.toString();
      }
    }
    return 'unknown';
  };

  const total = userActions.length + actions.length;
  const completed = userActions.reduce((progress, userAction) => {
    if (userAction?.status) {
      progress++;
    }
    return progress;
  }, 0);

  return (
    <div className="w-full ml-4 flex flex-row justify-center items-center absolute mt-6">
      <div className="h-3 w-2/5 bg-gray-tint-2 bg-opacity-70 rounded-lg">
        <div
          className={`h-3  ${
            'w-' + completed + '/' + total
          } rounded-lg text-right ${
            'category_' +
            getCategoryName(categoriesWithMembershipAchievement)
              .toLowerCase()
              .replace(/ /g, '_') +
            '_active'
          }`}
        />
      </div>
      <span className="ml-5 text-sm">{completed + '/' + total}</span>
    </div>
  );
};

export default ProgressBar;
