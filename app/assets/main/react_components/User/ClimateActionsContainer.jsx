import React, { useEffect, useState } from "react";
import CarouselContainer from "./CarouselContainer.jsx";
import CarouselActionItem from "./CarouselActionItem.jsx";
import { useDeletedAction } from "./contexts/DeletedActionContext.js";
import {
  useClimateActions,
  useClimateActionsUpdate,
  useClimateActionsOriginal,
} from "./contexts/ClimateActionsContext.js";
import Sidebar from "./Sidebar.jsx";

const ClimateActionsContainer = ({ user, climateActionCategories }) => {
  const deletedAction = useDeletedAction();
  const climateActions = useClimateActions();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();

  const [monthlyAction, setMonthlyAction] = useState(
    totClimateActions.find((action) => action.action_of_the_month === true)
  );

  const updateLocalAccepted = (actionID) => {
    setClimateActions(
      climateActions.map((action) =>
        action.id === actionID
          ? { ...action, accepted: !action.accepted }
          : action
      )
    );
    monthlyAction.id === actionID &&
      setMonthlyAction({ ...monthlyAction, accepted: !monthlyAction.accepted });
  };

  const formatedCategories = JSON.parse(climateActionCategories);

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  return (
    <div className="flex flex-row">
      <div className="flex-grow">
        <div className="hidden t:block">
          <div className="w-80 mx-auto space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2 justify-center">
            <h3 className="heading-lg mb-3">Action of the Month </h3>
            {monthlyAction && (
              <CarouselActionItem
                action={monthlyAction}
                key={monthlyAction.id}
                user={user}
                updateLocalAccepted={updateLocalAccepted}
                categories={formatedCategories}
              ></CarouselActionItem>
            )}
          </div>
        </div>
        <CarouselContainer
          user={user}
          updateLocalAccepted={updateLocalAccepted}
          categories={formatedCategories}
        />
      </div>

      <div className="flex-shrink sticky float-right bg-white h-screen top-20 z-10 border-l border-gray-accent">
        <Sidebar categories={formatedCategories} />
      </div>
    </div>
  );
};
export default ClimateActionsContainer;
