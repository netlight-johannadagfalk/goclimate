import React from 'react';
import {
  categoryName,
  getCategoryColor
} from '../../../helpers/CategoryColorHelper';

const CategoryColorBanner = ({ categories, action }) => {
  const bannerColor =
    'category_' +
    categoryName(categories, action.climate_action_category_id)
      .toLowerCase()
      .replace(/ /g, '_') +
    '_active';

  return (
    <div
      className={`${bannerColor} group-hover:${getCategoryColor(
        bannerColor
      )} h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60`}
    ></div>
  );
};
export default CategoryColorBanner;
