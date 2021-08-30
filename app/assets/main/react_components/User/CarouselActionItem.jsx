import React from "react";
import { useDeletedActionUpdate } from "./contexts/DeletedActionContext.js";
import {
  useUserActions,
  useUserActionsUpdate,
  useUserActionsColumnsWithFullFormatUpdate,
} from "./contexts/UserActionsContext.js";

const CarouselActionItem = ({ action, user, updateLocalAccepted }) => {
  const currUser = JSON.parse(user);
  const userActions = useUserActions();
  const setUserActions = useUserActionsUpdate();
  const setDeletedAction = useDeletedActionUpdate();
  const setColumnsWithFullFormat = useUserActionsColumnsWithFullFormatUpdate();

  const acceptAction = (action, userAction) => {
    setDeletedAction(null);
    const temp = {
      id: userAction.id,
      name: action.name,
      description: action.description,
      climate_action_id: action.id,
      status: userAction.status,
      user_id: userAction.user_id,
    };
    const tempList = [...userActions, temp];
    setUserActions(tempList);
    setColumnsWithFullFormat(tempList);
  };

  //FUNCTION WHERE USER ACCEPT AN ACTION IN DB -> MOVES TO ACCEPTED
  const updateAccepted = (action) => {
    const actionID = action.id;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const URL = "/user_climate_actions";
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        climate_action_id: actionID,
        user_id: currUser.id,
        status: false,
      }),
    };

    fetch(URL, requestOptions)
      .then((res) => res.json())
      .then((json) => acceptAction(action, json))
      .catch((e) => console.log(e));
  };
  const handleClickAccepted = (action) => {
    updateLocalAccepted(action.id);
    updateAccepted(action);
  };
  return (
    <div
      className={
        action.action_of_the_month
          ? "callout border-8 shadow-none min-h-full p-2 ml-2 mr-2 flex justify-center"
          : "callout shadow-none min-h-full p-2 ml-2 mr-2 flex justify-center"
      }
    >
      <div className="flex flex-col text-center">
        <div className="flex-1">
          <h4
            className="text-base font-bold justify-center"
            style={{ color: "rgba(28, 70, 55, var(--tw-text-opacity))" }}
          >
            {action.name.length > 25
              ? action.name.slice(0, 25) + "..."
              : action.name}
          </h4>
        </div>
        <div className="flex-1">
          <p>
            {action.description.length > 40
              ? action.description.slice(0, 40) + "..."
              : action.description}
          </p>
        </div>
        <div className="flex-1">
          <img src="earth.png" className=" flex"></img>
        </div>
        <div className="flex-1 flex-none mb-1">
          {action.points ? (
            <label>Impact: {action.points} CO2</label>
          ) : (
            <label>Impact: unknown</label>
          )}
        </div>
        <div className="flex-1">
          {action.accepted ? (
            <button
              className="button inline-block "
              disabled={true}
              style={{ color: "rgba(28, 70, 55)" }}
            >
              Accepted
            </button>
          ) : (
            <button
              className="button button-cta inline-block "
              onClick={() => handleClickAccepted(action)}
            >
              Accept challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarouselActionItem;
