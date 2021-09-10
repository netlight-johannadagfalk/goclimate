import React, { useEffect, useState } from "react";
import CarouselContainer from "./carousel/CarouselContainer.jsx";
import { useDeletedAction } from "../../contexts/DeletedActionContext.js";
import {
  useClimateActions,
  useClimateActionsUpdate,
  useClimateActionsOriginal,
} from "../../contexts/ClimateActionsContext.js";
import MainInfo from "../footprint/MainInfo.jsx";
import ManageActions from "./manage_actions/ManageActions.jsx";

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

      <ManageActions categories={formatedCategories}></ManageActions>
    </>
  );
};
export default ClimateActionsContainer;
