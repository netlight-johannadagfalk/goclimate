import React, { useEffect, useState } from 'react';
import CarouselContainer from './carousel/CarouselContainer.jsx';
import { useDeletedAction } from '../contexts/DeletedActionContext.js';
import {
  useClimateActions,
  useClimateActionsUpdate,
  useClimateActionsOriginal
} from '../contexts/ClimateActionsContext.js';
import { useUserState } from '../contexts/UserContext.js';
import MainInfo from '../footprint/MainInfo.jsx';
import ManageUserActions from './manage_actions/ManageUserActions.jsx';

const ClimateActionsContainer = ({
  user,
  climateActionCategories,
  actionsToplist
}) => {
  const deletedAction = useDeletedAction();
  const climateActions = useClimateActions();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();
  const { getInitialData: getInitialData } = useUserState();
  const [monthlyAction, setMonthlyAction] = useState(
    totClimateActions.find((action) => action.action_of_the_month === true)
  );
  const [localUserActions, setLocalUserActions] = useState([]);
  const [locallyDeletedActions, setLocallyDeletedActions] = useState([]);

  const updateLocalAccepted = (actionID) => {
    setClimateActions(
      climateActions.map((action) =>
        action.id === actionID
          ? {
              ...action,
              accepted: !action.accepted,
              total: deletedAction
                ? action.total > 0
                  ? --action.total
                  : (action.total = 0)
                : ++action.total
            }
          : action
      )
    );
    let filteredLocalUserActions = climateActions.filter(
      (action) => action.id === actionID
    );
    let tempArray = [...localUserActions, ...filteredLocalUserActions];
    if (deletedAction) {
      const localUserActionsWithoutDeleted = tempArray.filter(
        (action) => action.id !== deletedAction
      );
      tempArray = localUserActionsWithoutDeleted;
    }
    setLocalUserActions(tempArray);

    monthlyAction.id === actionID &&
      setMonthlyAction({ ...monthlyAction, accepted: !monthlyAction.accepted });
  };

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
    setLocallyDeletedActions([...locallyDeletedActions, deletedAction]);
  }, [deletedAction]);

  return (
    <>
      {getInitialData.isSuccess && (
        <>
          <MainInfo
            action={monthlyAction}
            user={user}
            updateLocalAccepted={updateLocalAccepted}
            categories={climateActionCategories}
          ></MainInfo>
          {climateActions.length > 0 && (
            <CarouselContainer
              user={user}
              updateLocalAccepted={updateLocalAccepted}
              categories={climateActionCategories}
              localUserActions={localUserActions}
              locallyDeletedActions={locallyDeletedActions}
              actionsToplist={actionsToplist}
            />
          )}
          <ManageUserActions
            categories={climateActionCategories}
          ></ManageUserActions>
        </>
      )}
    </>
  );
};
export default ClimateActionsContainer;
