import React, { useState, useEffect } from "react";
import CarouselContainer from "./CarouselContainer.jsx";
import KanbanActionContainer from "./KanbanActionContainer.jsx";
import Sidebar from "./Sidebar.jsx";
import CarouselActionItem from "./CarouselActionItem.jsx";
//*** The ContextProvider needs to be imported  */
import { useCategoryUpdate } from "./contexts/CategoryContext.js";
import {
  useDeletedAction,
  useDeletedActionUpdate,
} from "./contexts/DeletedActionContext.js";

const ClimateActionsContainer = ({
  user,
  allUserActions,
  actionsWithUserActions,
  actionsWithoutUserActions,
  climateActionCategories,
}) => {
  const [totUserActions, setTotUserActions] = useState(
    JSON.parse(allUserActions)
  );
  //const [deletedAction, setDeletedAction] = useState(null);

  const deletedAction = useDeletedAction();
  const setDeletedAction = useDeletedActionUpdate();
  //const [currCategory, setCurrCategory] = useState(null);
  //const currCategory = useCategory();

  //**** TA MED SIMON */

  const addAcceptedAction = (action, userAction) => {
    setDeletedAction(null);
    const temp = {
      id: userAction.id,
      name: action.name,
      description: action.description,
      climate_action_id: action.id,
      status: userAction.status,
      user_id: userAction.user_id,
    };
    const localVar = [...totUserActions, temp];
    setTotUserActions(localVar);
    setColumns(
      columnUserActions(
        acceptedUserActions(localVar),
        doneUserActions(localVar)
      )
    );
  };

  const setLocalAccepted = (updatedList, performed, deletedAction) => {
    setTotUserActions([...updatedList, ...performed]);
    setColumns(columnUserActions(updatedList, performed));
    setDeletedAction(deletedAction);
  };
  //******************************************************* */

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
      acceptedUserActions(totUserActions),
      doneUserActions(totUserActions)
    )
  );
  //******************************************************* */

  const localActionsWithUserActions = JSON.parse(actionsWithUserActions).map(
    (action) => ({
      ...action,
      accepted: true,
    })
  );

  const localActionsWithoutUserActions = JSON.parse(
    actionsWithoutUserActions
  ).map((action) => ({
    ...action,
    accepted: false,
  }));

  const totClimateActions = [
    ...localActionsWithoutUserActions,
    ...localActionsWithUserActions,
  ];

  //Ska byta namn till climateActions, används till karusellern
  const [climateActionsUser, setClimateActionsUser] = useState([
    ...totClimateActions,
  ]);

  const updateLocalAccepted = (actionID) => {
    setClimateActionsUser(
      climateActionsUser.map((action) =>
        action.id === actionID
          ? { ...action, accepted: !action.accepted }
          : action
      )
    );
  };
  const monthlyAction = totClimateActions.find(
    (action) => action.action_of_the_month === true
  );

  //************************************************************************** */
  //***** FUNCTION TO UPDATE CONTEXT THAT IS CREATED WITH USECATEGORYUPDATE */
  //************************************************************************** */
  const updateCategory = useCategoryUpdate();

  const setCategory = (cat) => {
    //***** HERE WE UPDATE THE CONTEXT */
    updateCategory(cat);
    const filteredActions = cat
      ? totClimateActions.filter(
          (temp) => temp.climate_action_category_id === cat
        )
      : totClimateActions;

    const filteredActionsWithStatus = filteredActions.map((x) => {
      return totUserActions.some((y) => y.climate_action_id === x.id)
        ? { ...x, accepted: true }
        : { ...x, accepted: false };
    });
    setClimateActionsUser(filteredActionsWithStatus);
  };

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
        climateActionsUser={climateActionsUser}
        updateLocalAccepted={updateLocalAccepted}
        addAcceptedAction={addAcceptedAction}
        deletedAction={deletedAction}
        climateActionCategories={climateActionCategories}
        //category={currCategory}
        setCategory={setCategory}
      />
      <KanbanActionContainer
        setLocalAccepted={setLocalAccepted}
        columns={columns}
        setColumns={setColumns}
        setTotUserActions={setTotUserActions}
      />
    </>
  );
};
export default ClimateActionsContainer;
