import React from 'react';
import UserActionCardExpanded from './UserActionCardExpanded.jsx';
import {
  categoryName,
  getCategoryColor
} from '../../../../helpers/CategoryColorHelper.js';

const UserActionCard = ({
  isAchievement,
  categories,
  userAction,
  handleDelete
}) => {
  const bannerColor =
    'category_' +
    categoryName(
      categories,
      userAction.climate_action_category_id,
      isAchievement
    )
      .toLowerCase()
      .replace(/ /g, '_') +
    '_active';

  return (
    <>
      <div className="h-20">
        <div
          className={`${bannerColor} group-hover:${getCategoryColor(
            bannerColor
          )} h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60 top-0 absolute z-0`}
        ></div>
      </div>
      {userAction.expanded && (
        <UserActionCardExpanded
          userAction={userAction}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default UserActionCard;
