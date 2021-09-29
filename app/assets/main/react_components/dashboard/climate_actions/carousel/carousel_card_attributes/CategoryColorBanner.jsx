import React from "react";
import { categoryName } from "../../../../helpers/CategoryColorHelper";

const CategoryColorBanner = ({ categories, action }) => {
  return (
    <div
      className={`${
        "category_" +
        categoryName(categories, action.climate_action_category_id)
          .toLowerCase()
          .replace(/ /g, "_") +
        "_active"
      } h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60`}
    ></div>
  );
};
export default CategoryColorBanner;
