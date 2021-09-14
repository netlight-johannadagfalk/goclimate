import React, { useEffect, useState } from "react";
import CarouselContainer from "./CarouselContainer.jsx";
// import CarouselActionItem from "./CarouselActionItem.jsx";
import { useDeletedAction } from "./contexts/DeletedActionContext.js";
import {
  useClimateActions,
  useClimateActionsUpdate,
  useClimateActionsOriginal,
} from "./contexts/ClimateActionsContext.js";
import Sidebar from "./Sidebar.jsx";
import MobileKanbanContainer from "./MobileKanbanContainer.jsx";
import { useMediaQuery } from "react-responsive";
import MainInfo from "./MainInfo.jsx";

const ClimateActionsContainer = ({
  user,
  climateActionCategories,
  footprint,
  commonText,
  countryAverage,
  modelText,
  lang,
  registrationsText,
  totalNoFootprints,
}) => {
  const deletedAction = useDeletedAction();
  const climateActions = useClimateActions();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();

  const [monthlyAction, setMonthlyAction] = useState(
    totClimateActions.find((action) => action.action_of_the_month === true)
  );

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

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
  //const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  const [showMobileKanban, setShowMobileKanban] = useState(false);

  const getTotalAmountOfAcceptedActionsForUser = () => {
    let amountActionsAccepted = 0;
    climateActions.map((action) => {
      if (action.accepted === true) {
        amountActionsAccepted++;
      }
    });
    return amountActionsAccepted;
  };

  return (
    <>
      {isTabletOrMobile && (
        <div className="fixed top-0 right-0 mr-20 mt-6 lg:mr-48 lg:right-10 t:mr-17 t:right-3 z-50">
          <i
            className={`fas fa-2x ${
              showMobileKanban ? "fa-globe-americas" : "fa-globe-europe"
            }`}
            onClick={() => setShowMobileKanban(!showMobileKanban)}
          ></i>
          <div className="fas rounded-full h-5 w-5 bg-green-tint-2 border border-gray-accent -mt-1 -ml-3 absolute focus:outline-none">
            <div className="mb-2 text-white">
              {getTotalAmountOfAcceptedActionsForUser()}
            </div>
          </div>
        </div>
      )}
      <MainInfo
        footprint={JSON.parse(footprint)}
        commonText={commonText}
        action={monthlyAction}
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={JSON.parse(climateActionCategories)}
        countryAverage={countryAverage}
        modelText={modelText}
        lang={lang}
        registrationsText={registrationsText}
        totalNoFootprints={totalNoFootprints}
      ></MainInfo>
      <CarouselContainer
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={formatedCategories}
      />
      {showMobileKanban && (
        <MobileKanbanContainer categories={formatedCategories} clicked={true} />
      )}
      {!isTabletOrMobile && (
        <div className="w-full">
          <Sidebar categories={formatedCategories} />
        </div>
      )}
    </>
  );
};
export default ClimateActionsContainer;
