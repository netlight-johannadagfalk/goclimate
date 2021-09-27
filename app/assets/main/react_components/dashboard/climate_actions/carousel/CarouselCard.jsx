import React, { useRef, useEffect } from "react";
import { useClimateActionsText } from "../../../contexts/TextContext.js";
import { useDeletedActionUpdate } from "../../../contexts/DeletedActionContext.js";
import CategoryColor from "./carousel_card_attributes/CategoryColor.jsx";
import ActionPoints from "./carousel_card_attributes/ActionPoints.jsx";
import AcceptanceStatistics from "./carousel_card_attributes/AcceptanceStatistics.jsx";
import TextBanner from "../../../common/TextBanner.jsx";
import { useUserState, useUserActions } from "../../../contexts/UserContext.js";
import { updateAccepted } from "../../../helpers/DBRequests.js";

const CarouselCard = ({
  action,
  user,
  updateLocalAccepted,
  categories,
  monthlyActionBanner,
}) => {
  const currUser = JSON.parse(user);
  const { data: data } = useUserState();
  const { updateUserActions, updateColumnsWithFullFormat } = useUserActions();

  const setDeletedAction = useDeletedActionUpdate();
  const userActions = data.userActions;
  const achievements = data.achievements;
  const climateActionsText = useClimateActionsText();
  const text = climateActionsText.monthly_action;
  const mounted = useRef(false);

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
    updateUserActions(tempList);
    updateColumnsWithFullFormat(tempList, achievements);
  };

  const handleClickAccepted = (action) => {
    updateLocalAccepted(action.id);
    updateAccepted(action, currUser, mounted, acceptAction);
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <div className="flex flex-1 min-h-full">
      <div className="pt-20 flex m-lg:pt-24 flex-1 justify-evenly">
        <div className=" border-gray-tint-2 rounded-lg shadow-lg pb-2 ml-2 mr-2 flex flex-col flex-1 bg-white">
          <CategoryColor categories={categories} action={action} />
          <div
            className={`mx-auto bg-gray-tint-2 bg-opacity-10 shadow-md -mt-24 rounded-full h-40 w-40 items-center justify-center bg-cover filter drop-shadow-xl`}
            style={{
              backgroundImage: action.image_url
                ? `url('${action.image_url}')`
                : "url('/action_images/Globe.png')",
              backgroundSize: "100%",
            }}
          >
            {action.action_of_the_month && !monthlyActionBanner && (
              <TextBanner text={text} />
            )}
          </div>
          <div className="flex flex-col flex-1 text-center mx-2">
            <ActionPoints action={action} />
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
              <AcceptanceStatistics action={action} />
              {!action.accepted && (
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
export default CarouselCard;
