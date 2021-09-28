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
import { useUserState } from "../../contexts/UserContext.js";
import MainInfo from "../footprint/MainInfo.jsx";
import ManageActions from "./manage_actions/ManageActions.jsx";

const ClimateActionsContainer = ({
  user,
  climateActionCategories,
  actionsToplist,
}) => {
  const deletedAction = useDeletedAction();
  const setDeletedAction = useDeletedActionUpdate();
  const climateActions = useClimateActions();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();

  const { data: data, getInitialData: getInitialData } = useUserState();
  const userActions = data.userActions;

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

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  return (
    <>
      {getInitialData.isSuccess && (
        <>
          <MainInfo
            action={monthlyAction}
            user={user}
            updateLocalAccepted={updateLocalAccepted}
            categories={JSON.parse(climateActionCategories)}
          ></MainInfo>
          {climateActions.length > 0 && (
            <CarouselContainer
              user={user}
              updateLocalAccepted={updateLocalAccepted}
              categories={formatedCategories}
              localUserActions={localUserActions}
              actionsToplist={actionsToplist}
            />
          )}
          <ManageActions categories={formatedCategories}></ManageActions>
        </>
      )}
    </>
  );
};
export default ClimateActionsContainer;
