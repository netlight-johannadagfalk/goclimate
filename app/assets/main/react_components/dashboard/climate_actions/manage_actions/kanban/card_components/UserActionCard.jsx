import React from "react";
import UserActionCardExpanded from "./UserActionCardExpanded.jsx";
import CardImage from "./CardImage.jsx";

const UserActionCard = ({
  categoryColor,
  userAction,
  handleDelete,
  handleCompleteAction,
  sidebarCollapsed,
}) => {
  return (
    <div>
      <div className="h-20">
        <div
          className={`${
            "category_" +
            categoryColor.toLowerCase().replace(/ /g, "_") +
            "_active"
          } h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60 top-0 absolute z-0`}
        ></div>

        <CardImage
          img={userAction.image_url}
          sidebarCollapsed={sidebarCollapsed}
        ></CardImage>
      </div>

      <div>
        {userAction.expanded && (
          <UserActionCardExpanded
            userAction={userAction}
            handleDelete={handleDelete}
            handleCompleteAction={handleCompleteAction}
          ></UserActionCardExpanded>
        )}
      </div>
    </div>
  );
};

export default UserActionCard;
