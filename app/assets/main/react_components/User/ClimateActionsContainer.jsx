import React, { useState, useEffect } from "react";
import CarouselContainer from "./CarouselContainer.jsx";
import KanbanActionContainer from "./KanbanActionContainer.jsx";
import Sidebar from "./Sidebar.jsx";
import CarouselActionItem from "./CarouselActionItem.jsx";
import {
  useDeletedAction,
  useDeletedActionUpdate,
} from "./contexts/DeletedActionContext.js";
import {
  useUserActions,
  useUserActionsUpdate,
} from "./contexts/UserActionsContext.js";
import {
  useClimateActions,
  useClimateActionsUpdate,
  useClimateActionsOriginal,
} from "./contexts/ClimateActionsContext.js";

const ClimateActionsContainer = ({ user, climateActionCategories }) => {
  const userActions = useUserActions();
  const setUserActions = useUserActionsUpdate();

  const deletedAction = useDeletedAction();
  const setDeletedAction = useDeletedActionUpdate();

  const climateActions = useClimateActions();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();

  //const [currCategory, setCurrCategory] = useState(null);
  //const currCategory = useCategory();

  const addAcceptedAction = (action, userAction) => {
    //Depends on
    // context deletedAction
    // context userActions
    // context columns + columnUserActions...
    // Can be moved to carousel component

    setDeletedAction(null);
    const temp = {
      id: userAction.id,
      name: action.name,
      description: action.description,
      climate_action_id: action.id,
      status: userAction.status,
      user_id: userAction.user_id,
    };
    const localVar = [...userActions, temp];
    setUserActions(localVar);
    setColumns(
      columnUserActions(
        acceptedUserActions(localVar),
        doneUserActions(localVar)
      )
    );
  };

  const setLocalAccepted = (updatedList, performed, deletedAction) => {
    setUserActions([...updatedList, ...performed]);
    setColumns(columnUserActions(updatedList, performed));
    setDeletedAction(deletedAction);
  };
  //******************************************************* */
  // Should be moved to dahboard

  const formatedUserActions = (inVal) => {
    return inVal.map((userActions) => ({
      ...userActions,
      id: userActions.id.toString(),
    }));
  };

  const acceptedUserActions = (inVal) => {
    return formatedUserActions(inVal)
      .filter((action) => action.status !== true)
      .map((action) => ({ ...action }));
  };
  const doneUserActions = (inVal) => {
    return formatedUserActions(inVal)
      .filter((action) => action.status !== false)
      .map((action) => ({ ...action }));
  };

  const columnUserActions = (acceptedList, doneActions) => {
    return {
      [1]: {
        id: "Accepted",
        name: "Your accepted actions:",
        items: acceptedList,
      },
      [2]: {
        id: "Performed",
        name: "Your performed actions:",
        items: doneActions,
      },
    };
  };

  //Flytta till context
  const [columns, setColumns] = useState(
    columnUserActions(
      acceptedUserActions(userActions),
      doneUserActions(userActions)
    )
  );
  //******************************************************* */
  // Should be moved to dashboard.jsx or context?

  //******************************************************* */

  const updateLocalAccepted = (actionID) => {
    //Depends on context climateAction
    //used by both carousel and kanban, flytta funktion till context?
    setClimateActions(
      climateActions.map((action) =>
        action.id === actionID
          ? { ...action, accepted: !action.accepted }
          : action
      )
    );
  };
  const monthlyAction = totClimateActions.find(
    (action) => action.action_of_the_month === true
  );

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  //********************************* RETURN ***************************************** */

  return (
    <>
      <Sidebar />
      <div className="w-80 mx-auto  space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2 justify-center">
        <h3 className="heading-lg mb-3">Action of the Month </h3>
        {monthlyAction && (
          <CarouselActionItem
            action={monthlyAction}
            key={monthlyAction.id}
            user={user}
            updateLocalAccepted={updateLocalAccepted}
            addAcceptedAction={addAcceptedAction}
          ></CarouselActionItem>
        )}
      </div>

      <CarouselContainer
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        addAcceptedAction={addAcceptedAction}
        climateActionCategories={climateActionCategories}
      />
      <KanbanActionContainer
        setLocalAccepted={setLocalAccepted}
        columns={columns}
        setColumns={setColumns}
      />
    </>
  );
};
export default ClimateActionsContainer;
