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
import MobileKanbanContainer from "./MobileKanbanContainer.jsx";
import { useMediaQuery } from "react-responsive";

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
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  const [showMobileKanban, setShowMobileKanban] = useState(false);

  return (
    <>
      {isTabletOrMobile && (
        <div className="fixed top-0 z-50 right-0 mr-20 mt-6">
          <i
            className={`fas fa-2x ${
              showMobileKanban ? "fa-globe-americas" : "fa-globe-europe"
            }`}
            onClick={() => setShowMobileKanban(!showMobileKanban)}
          ></i>
          <div className="fas rounded-full h-4 w-4 bg-green-tint-2 border border-gray-accent -mt-1 -ml-3 absolute focus:outline-none">
            4
          </div>
        </div>
      )}
      <div className="hidden t:block">
        <div className="w-80 mx-auto  space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2 justify-center">
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
      {showMobileKanban && (
        <MobileKanbanContainer categories={formatedCategories} />
      )}
      {!isTabletOrMobile && <Sidebar categories={formatedCategories} />}
    </>
  );
};
export default ClimateActionsContainer;
