import React from "react";

const ProgressBar = ({ categories, item, userActions, actions }) => {
  const categoriesWithMembershipAchievement = [
    ...categories,
    { id: "-1", name: "Climate Friend" },
  ];
  const categoryName = (categories) => {
    for (let i = 0; i <= Object.keys(categories).length - 1; i++) {
      if (categories[i].id == item.id) {
        return categories[i].name.toString();
      }
    }
    return "unknown";
  };

  const total = userActions.length + actions.length;
  const calculateProgressBar = () => {
    let progress = 0;
    userActions.map((userAction) => {
      if (userAction.status === true) {
        progress++;
      }
    });
    return progress;
  };

  const progress = calculateProgressBar();
  return (
    <div className="w-full ml-1 flex flex-row justify-center items-center absolute mt-9">
      <div className="h-3 w-2/5 bg-gray-tint-2 bg-opacity-70 rounded-lg">
        <div
          className={`h-3  ${
            "w-" + progress + "/" + total
          } rounded-lg text-right ${
            "category_" +
            categoryName(categoriesWithMembershipAchievement)
              .toLowerCase()
              .replace(/ /g, "_") +
            "_active"
          }`}
        ></div>
      </div>

      <span className="ml-5 text-sm">{`${progress + "/" + total}`}</span>
    </div>
  );
};

export default ProgressBar;
