import React from 'react';
import { useClimateActionsText } from '.././../../../../contexts/TextContext.js';
import { handleCompleteActionOnClick } from '../../../../../helpers/KanbanHelper.js';
import {
  useUserState,
  useUserActions
} from '../../../../../contexts/UserContext.js';

const UserActionCardExpanded = ({ userAction, handleDelete }) => {
  const {
    updateUserActions,
    updateColumns,
    updateAchievements,
    updateAchievementsOnMove
  } = useUserActions();
  const { data: data } = useUserState();
  const columns = data.columns;
  const climateActionsText = useClimateActionsText();

  return (
    <div className="mt-1 mx-6 flex flex-col text-center">
      <div className="flex-1 justify-center text-left">
        <p className="text-sm">
          {userAction.description.length > 200
            ? userAction.description.slice(0, 200) + '...'
            : userAction.description}
        </p>
      </div>
      <div className="flex-1 justify-center mt-4 mb-4">
        <button
          className=" mr-4 fas fa-trash-alt h-4 w-4 focus:outline-none"
          onClick={() =>
            handleDelete(userAction.id, userAction.climate_action_id)
          }
        ></button>
        <button
          className={`rounded-full py-1 px-4 button inline-block focus:outline-none text-primary text-sm border border-color-primary m-1`}
          onClick={() =>
            handleCompleteActionOnClick(
              userAction,
              columns,
              updateUserActions,
              updateColumns,
              updateAchievements,
              updateAchievementsOnMove
            )
          }
        >
          {climateActionsText.action_performed}
        </button>
      </div>
    </div>
  );
};

export default UserActionCardExpanded;
