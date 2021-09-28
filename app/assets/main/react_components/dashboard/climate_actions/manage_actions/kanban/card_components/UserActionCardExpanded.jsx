import React from "react";
import { useClimateActionsText } from ".././../../../../contexts/TextContext.js";

const UserActionCardExpanded = ({
  userAction,
  handleDelete,
  handleCompleteAction,
}) => {
  const climateActionsText = useClimateActionsText();
  return (
    <div>
      <div className="mx-6 flex flex-1 flex-col text-center">
        <div className="flex-1 justify-center text-left">
          <p className="text-sm">
            {userAction.description.length > 200
              ? userAction.description.slice(0, 200) + "..."
              : userAction.description}
          </p>
        </div>
        <div className="flex-1 justify-center mt-4 mb-2">
          <button
            className=" mr-4 fas fa-trash-alt h-4 w-4 focus:outline-none"
            onClick={() =>
              handleDelete(userAction.id, userAction.climate_action_id)
            }
          ></button>
          <button
            className={`rounded-full py-1 px-4 button inline-block focus:outline-none text-primary text-sm border border-color-primary m-1`}
            onClick={() => handleCompleteAction(userAction)}
          >
            {climateActionsText.action_completed}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActionCardExpanded;
