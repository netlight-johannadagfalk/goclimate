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
import MainInfo from "../footprint/MainInfo.jsx";
import ManageActions from "./manage_actions/ManageActions.jsx";

const ClimateActionsContainer = ({ user, climateActionCategories }) => {
  const deletedAction = useDeletedAction();
  const setDeletedAction = useDeletedActionUpdate();
  const climateActions = useClimateActions();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();

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

    let temp = climateActions.filter((action) => action.id === actionID);

    let tempArray = [...localUserActions, temp];
    let temp2 = [];
    if (deletedAction !== null) {
      console.log("deletedAction not null");
      console.log({ tempArray, deletedAction });
      temp2 = tempArray.filter((action) => action[0].id !== deletedAction);
      console.log({ temp2 });
      tempArray = temp2;
    }

    setLocalUserActions(tempArray);

    monthlyAction.id === actionID &&
      setMonthlyAction({ ...monthlyAction, accepted: !monthlyAction.accepted });

    //is this needed?
    setDeletedAction(null);
  };

  // const updateLocalAccepted = (actionID) => {
  //   setClimateActionsUser(
  //     climateActionsUser.map((action) =>
  //       action.id === actionID
  //         ? {
  //             ...action,
  //             accepted: !action.accepted,
  //             total: deletedAction ? --action.total : ++action.total,
  //           }
  //         : action
  //     )
  //   );
  //   setDeletedAction(null);
  // };

  const formatedCategories = JSON.parse(climateActionCategories);

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
      />

      <ManageActions categories={formatedCategories}></ManageActions>
    </>
  );
};
export default ClimateActionsContainer;
