import React from "react";
import { useDeletedActionUpdate } from "../../../contexts/DeletedActionContext.js";
import {
  useUserActions,
  useUserActionsUpdate,
  useUserActionsColumnsWithFullFormatUpdate,
  useCategoryBadges,
} from "../../../contexts/UserActionsContext.js";
import { useClimateActionsText } from "../../../contexts/TextContext.js";

const CarouselActionItem = ({
  action,
  user,
  updateLocalAccepted,
  categories,
}) => {
  const currUser = JSON.parse(user);
  const userActions = useUserActions();
  const setUserActions = useUserActionsUpdate();
  const setDeletedAction = useDeletedActionUpdate();
  const setColumnsWithFullFormat = useUserActionsColumnsWithFullFormatUpdate();
  const categoryBadges = useCategoryBadges();
  const climateActionsText = useClimateActionsText();

  const categoryName = () => {
    for (let i = 0; i <= Object.keys(categories).length; i++) {
      if (categories[i].id === action.climate_action_category_id) {
        return categories[i].name.toString();
      }
    }
    return "unknown";
  };

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
      image_url: action.image_url,
    };
    const tempList = [...userActions, temp];
    setUserActions(tempList);
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
      <div className="pt-20 flex m-lg:pt-24 flex-1 justify-evenly">
        <div className=" border-gray-tint-2 rounded-lg shadow-lg pb-2 ml-2 mr-2 flex flex-col flex-1 bg-white">
          <div
            className={`${
              "category_" +
              categoryName().toLowerCase().replace(/ /g, "_") +
              "_active"
            } h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60`}
          ></div>
          <div
            className={`mx-auto bg-gray-tint-2 bg-opacity-10 shadow-md -mt-1/2 rounded-full h-40 w-40 items-center justify-center bg-cover filter drop-shadow-xl`}
            style={{
              backgroundImage: action.image_url
                ? `url('${action.image_url}')`
                : "url('/action_images/Globe.png')",
              backgroundSize: "100%",
            }}
          ></div>
          <div className="flex flex-col flex-1 text-center mx-2">
            <div className="flex-1 flex flex-row justify-center self-center">
              {[1, 2, 3, 4, 5].map((index) => {
                return (
                  <span
                    className={`flex flex-row self-center bg-gray-tint-2 m-2 rounded-full h-6 w-6 justify-center bg-cover`}
                    key={action.name + index}
                    style={
                      index <= action.points
                        ? {
                            backgroundImage: "url('/action_images/Globe.png')",
                          }
                        : {}
                    }
                  ></span>
                );
              })}
            </div>
            <div className=" flex-1 justify-center align-center self-center">
              <h3 className={`heading font-bold self-center text-lg`}>
                {action.name.length > 40
                  ? action.name.slice(0, 40) + "..."
                  : action.name}
              </h3>
            </div>

            <div className="flex-4">
              <p>
                {action.description.length > 200
                  ? action.description.slice(0, 200) + "..."
                  : action.description}
              </p>
            </div>

            <div className="flex-1 mt-5 justify-center align-center">
              {action.accepted ? (
                <button
                  className="button inline-block "
                  disabled={true}
                  style={{ color: "rgba(28, 70, 55)" }}
                >
                  {climateActionsText.accepted}
                </button>
              ) : (
                <button
                  className="button inline-block "
                  onClick={() => handleClickAccepted(action)}
                >
                  {climateActionsText.accept}
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
