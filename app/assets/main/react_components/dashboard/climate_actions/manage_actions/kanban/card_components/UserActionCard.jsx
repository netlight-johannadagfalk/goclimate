import React from "react";

const UserActionCard = ({
  userAction,
  handleDelete,
  handleCompleteAction,
  sidebarCollapsed,
}) => {
  return (
    <div>
      {userAction.expanded && !sidebarCollapsed && (
        <div className="mt-4 mx-6 flex flex-1 flex-col text-center">
          <div className="flex-1 justify-center text-left">
            <p className="text-sm">
              {userAction.description.length > 200
                ? userAction.description.slice(0, 200) + "..."
                : userAction.description}
            </p>
          </div>
          <div className="flex-1 justify-center my-4">
            <button
              className=" mr-4 fas fa-times-circle h-4 w-4 focus:outline-none"
              onClick={() =>
                handleDelete(userAction.id, userAction.climate_action_id)
              }
            ></button>
            <button
              className="ml-4 fas fa-check-circle focus:outline-none"
              onClick={() => handleCompleteAction(userAction)}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActionCard;
