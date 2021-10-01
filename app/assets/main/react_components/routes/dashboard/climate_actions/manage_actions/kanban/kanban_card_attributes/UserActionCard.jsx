import React from 'react';
import UserActionCardExpanded from './UserActionCardExpanded.jsx';

const UserActionCard = ({
  categoryColor,
  userAction,
  handleDelete,
  categoryColorHover
}) => {
  const bannerColor =
    'category_' + categoryColor.toLowerCase().replace(/ /g, '_') + '_active';

  return (
    <div>
      <div className="h-20">
        <div
          className={`${bannerColor} group-hover:${categoryColorHover} h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60 top-0 absolute z-0`}
        ></div>
      </div>
      {userAction.expanded && (
        <UserActionCardExpanded
          userAction={userAction}
          handleDelete={handleDelete}
        ></UserActionCardExpanded>
      )}
    </div>
  );
};

export default UserActionCard;
