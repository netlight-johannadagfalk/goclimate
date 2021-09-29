import React from "react";

const ProgressBar = ({ categories, item, userActions, actions }) => {
  const categoriesWithMembershipBadge = [
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
    let progress_completed = 0;
    userActions.map((userAction) => {
      if (userAction.status === true) {
        progress_completed++;
      }
    });
    return progress_completed;
  };

  const completed = calculateProgressBar();
  return (
    <div className="w-full ml-1 flex flex-row justify-center items-center absolute mt-6">
      <div className="h-3 w-2/5 bg-gray-tint-2 bg-opacity-70 rounded-lg">
        <div
          className={`h-3  ${
            "w-" + completed + "/" + total
          } rounded-lg text-right ${
            "category_" +
            categoryName(categoriesWithMembershipBadge)
              .toLowerCase()
              .replace(/ /g, "_") +
            "_active"
          }`}
        ></div>
      </div>

      <span className="ml-5 text-sm">{`${completed + "/" + total}`}</span>
    </div>
  );
};

export default ProgressBar;
