import React, { useEffect, useState } from "react";
import CarouselContainer from "./carousel/CarouselContainer.jsx";
import {
  useDeletedAction,
  useDeletedActionUpdate,
} from "../../contexts/DeletedActionContext.js";
import {
  useClimateActions,
  useClimateActionsUpdate,
  useClimateActionsOriginal,
} from "../../contexts/ClimateActionsContext.js";
import { useUserActions } from "../../contexts/UserActionsContext";
import MainInfo from "../footprint/MainInfo.jsx";
import ManageActions from "./manage_actions/ManageActions.jsx";

const ClimateActionsContainer = ({ user, climateActionCategories }) => {
  const deletedAction = useDeletedAction();
  const setDeletedAction = useDeletedActionUpdate();
  const climateActions = useClimateActions();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();
  const userActions = useUserActions();

  const [monthlyAction, setMonthlyAction] = useState(
    totClimateActions.find((action) => action.action_of_the_month === true)
  );
  const [localUserActions, setLocalUserActions] = useState([]);

  const updateLocalAccepted = (actionID) => {
    setClimateActions(
      climateActions.map((action) =>
        action.id === actionID
          ? {
              ...action,
              accepted: !action.accepted,
              total: deletedAction ? --action.total : ++action.total,
            }
          : action
      )
    );
    //Saves all items that are userActions locally but not yet in DB to use for categoryFiltering
    let filteredLocalUserActions = climateActions.filter(
      (action) => action.id === actionID
    );
    let tempArray = [...localUserActions, filteredLocalUserActions];
    if (deletedAction) {
      const localUserActionsWithoutDeleted = tempArray.filter(
        (action) => action[0].id !== deletedAction
      );
      tempArray = localUserActionsWithoutDeleted;
    }
    setLocalUserActions(tempArray);
    setDeletedAction(null);

    monthlyAction.id === actionID &&
      setMonthlyAction({ ...monthlyAction, accepted: !monthlyAction.accepted });
  };

  const formatedCategories = JSON.parse(climateActionCategories);

  const findUserActionsWithStatusFalse = () => {
    let actionsAccepted = 0;
    userActions.map((action) => {
      if (action.status === false) {
        actionsAccepted++;
      }
    });
    return actionsAccepted;
  };

  const [acceptedActions, setAcceptedActions] = useState(
    findUserActionsWithStatusFalse
  );

  const updateNumberForMobileKanban = () => {
    setAcceptedActions(findUserActionsWithStatusFalse);
  };

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  return (
    <>
      <MainInfo
        action={monthlyAction}
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={JSON.parse(climateActionCategories)}
      ></MainInfo>
      <CarouselContainer
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={formatedCategories}
        localUserActions={localUserActions}
        updateNumberForMobileKanban={updateNumberForMobileKanban}
      />

      <ManageActions
        categories={formatedCategories}
        acceptedActions={acceptedActions}
      ></ManageActions>
    </>
  );
};
export default ClimateActionsContainer;
