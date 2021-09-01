import React from "react";
import { useDeletedActionUpdate } from "./contexts/DeletedActionContext.js";
import {
  useUserActions,
  useUserActionsUpdate,
  useUserActionsColumnsWithFullFormatUpdate,
  useCategoryBadges,
} from "./contexts/UserActionsContext.js";

const CarouselActionItem = ({
  action,
  user,
  updateLocalAccepted,
  categoryColor,
}) => {
  const currUser = JSON.parse(user);
  const userActions = useUserActions();
  const setUserActions = useUserActionsUpdate();
  const setDeletedAction = useDeletedActionUpdate();
  const setColumnsWithFullFormat = useUserActionsColumnsWithFullFormatUpdate();
  const categoryBadges = useCategoryBadges();

  const acceptAction = (action, userAction) => {
    setDeletedAction(null);
    const temp = {
      id: userAction.id,
      name: action.name,
      description: action.description,
      climate_action_id: action.id,
      status: userAction.status,
      user_id: userAction.user_id,
      climate_action_category_id: action.climate_action_category_id,
    };
    const tempList = [...userActions, temp];
    setUserActions(tempList);
    console.log({ categoryBadges });
    setColumnsWithFullFormat(tempList, categoryBadges);
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
    <div className="flex flex-1 min-h-full ">
      <div className="pt-20 flex m-lg:pt-24 flex justify-evenly">
        <div
          className={`${action.action_of_the_month && "border-8"}            
               ${categoryColor} border-gray-tint-2 rounded-lg shadow-lg p-2 ml-2 mr-2 flex flex-col flex-1`}
        >
          <img
            className="mx-auto -mt-20 rounded-full object-cover"
            src="https://www.goclimate.com/blog/wp-content/uploads/2020/07/DJI_0974-768x512.jpg"
          />
          <div className="flex flex-col text-center">
            <div className="flex-1">
              <h4 className="text-base font-bold justify-center">
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

            <div className="flex-1 flex flex-row mb-1 justify-center">
              {[1, 2, 3, 4, 5].map((index) => {
                return (
                  <span
                    className={`flex flex-row ${
                      index <= action.points ? "bg-black" : "bg-gray-pastel"
                    } m-2 rounded-full h-4 w-4 flex items-center justify-center`}
                    key={action.name + index}
                  ></span>
                );
              })}
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
      </div>
    </div>
  );
};

export default CarouselActionItem;
