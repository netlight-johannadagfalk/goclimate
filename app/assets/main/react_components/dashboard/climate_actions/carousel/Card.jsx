import React, { useRef, useEffect } from "react";
import { useDeletedActionUpdate } from "../../../contexts/DeletedActionContext.js";
import {
  useUserActions,
  useUserActionsUpdate,
  useUserActionsColumnsWithFullFormatUpdate,
  useCategoryBadges,
} from "../../../contexts/UserActionsContext.js";
import { useClimateActionsText } from "../../../contexts/TextContext.js";
import CategoryColor from "./CategoryColor.jsx";
import ShowClimateImpact from "./ShowActionPoints.jsx";
import ShowNumberOfPersonsAcceptedAction from "./ShowNumberOfPersonsAcceptedAction.jsx";
import CarouselImage from "./CarouselImage.jsx";

const Card = ({ action, user, updateLocalAccepted, categories }) => {
  const currUser = JSON.parse(user);
  const userActions = useUserActions();
  const setUserActions = useUserActionsUpdate();
  const setDeletedAction = useDeletedActionUpdate();
  const setColumnsWithFullFormat = useUserActionsColumnsWithFullFormatUpdate();
  const categoryBadges = useCategoryBadges();
  const climateActionsText = useClimateActionsText();

  const mounted = useRef(false);

  // const categoryName = () => {
  //   for (let i = 0; i <= Object.keys(categories).length; i++) {
  //     if (categories[i].id === action.climate_action_category_id) {
  //       return categories[i].name.toString();
  //     }
  //   }
  //   return "unknown";
  // };

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
    const tempList = [temp, ...userActions];
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
      .then((res) => {
        if (mounted.current) {
          return res.json();
        }
      })
      .then((json) => acceptAction(action, json))
      .catch((e) => console.warn(e));
  };
  const handleClickAccepted = (action) => {
    updateLocalAccepted(action.id);
    updateAccepted(action);
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <div className="flex flex-1 min-h-full ">
      <div className="pt-20 flex m-lg:pt-24 flex-1 justify-evenly">
        <div className=" border-gray-tint-2 rounded-lg shadow-lg pb-2 ml-2 mr-2 flex flex-col flex-1 bg-white">
          <CategoryColor categories={categories} action={action} />
          <CarouselImage action={action} />
          <div className="flex flex-col flex-1 text-center mx-2">
            <ShowClimateImpact action={action} />
            <div className="flex-1 justify-center align-center self-center">
              <h3 className={`text-base font-bold self-center`}>
                {action.name.length > 40
                  ? action.name.slice(0, 40) + "..."
                  : action.name}
              </h3>
            </div>
            <div className="flex-4">
              <p className="text-sm">
                {action.description.length > 200
                  ? action.description.slice(0, 200) + "..."
                  : action.description}
              </p>
            </div>
            <div className="flex-1 mt-5 justify-center align-center">
              {action.accepted && action.total > 1 ? (
                <ShowNumberOfPersonsAcceptedAction
                  startText={"You and"}
                  endText={"more have:"}
                  action={action}
                  disabled={true}
                  currentAloneUser={false}
                />
              ) : action.accepted && action.total == 1 ? (
                <ShowNumberOfPersonsAcceptedAction
                  startText={"You have accepted"}
                  endText={""}
                  action={action}
                  disabled={true}
                  currentAloneUser={true}
                />
              ) : (
                <div>
                  {!action.accepted && action.total !== 0 ? (
                    action.total > 1 ? (
                      <ShowNumberOfPersonsAcceptedAction
                        startText={"Do as"}
                        endText={"others:"}
                        action={action}
                        disabled={false}
                        currentAloneUser={false}
                      />
                    ) : (
                      <ShowNumberOfPersonsAcceptedAction
                        startText={"Do as"}
                        endText={"other"}
                        action={action}
                        disabled={false}
                        currentAloneUser={false}
                      />
                    )
                  ) : (
                    <ShowNumberOfPersonsAcceptedAction
                      startText={"Be the first one to:"}
                      endText={""}
                      action={action}
                      disabled={false}
                      currentAloneUser={true}
                    />
                  )}
                  <button
                    className="button inline-block "
                    onClick={() => handleClickAccepted(action)}
                  >
                    {climateActionsText.accept}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
