import React from "react";

const CategoryColorBanner = ({ categories, action }) => {
  const categoryName = () => {
    for (let i = 0; i <= Object.keys(categories).length; i++) {
      if (categories[i].id === action.climate_action_category_id) {
        return categories[i].name.toString();
      }
    }
    return "unknown";
  };
  return (
    <div
      className={`${
        "category_" +
        categoryName().toLowerCase().replace(/ /g, "_") +
        "_active"
      } h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60`}
    ></div>
  );
};
export default CategoryColorBanner;
