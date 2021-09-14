import React, { useEffect, useState } from "react";
import CarouselContainer from "./CarouselContainer.jsx";
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

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  return (
    <>
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
      {isTabletOrMobile && (
        <MobileKanbanContainer
          categories={formatedCategories}
          climateActions={climateActions}
        />
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
