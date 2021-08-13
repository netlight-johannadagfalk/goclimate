import React, { useState } from "react";
import CarouselContainer from "./CarouselContainer.jsx";
import KanbanActionContainer from "./KanbanActionContainer.jsx";

const ClimateActionsContainer = ({user, userActions, actionsWithUserActions, actionsWithoutUserActions,}) => {
  const [totUserActions, setTotUserActions] = useState(JSON.parse(userActions));
  const [deletedAction, setDeletedAction] = useState(null);

  const addAcceptedAction = (action, userAction) => {
    setDeletedAction(null)
    const temp = {
      id: userAction.id,
      name: action.name,
      description: action.description,
      climate_action_id: action.id,
      status: userAction.status,
      user_id: userAction.user_id,
    };
    const localVar= [...totUserActions, temp]
    setTotUserActions(localVar)
    setColumns(columnUserActions(acceptedUserActions(localVar), doneUserActions(localVar)))
  };

  const setLocalAccepted = (updatedList, performed, deletedAction) => {
    setTotUserActions([...updatedList, ...performed])
    setColumns(columnUserActions(updatedList, performed))
    setDeletedAction(deletedAction);
  };
  //******************************************************* */

  const formatedUserActions = (inVal) => { 
    return inVal.map((userActions) => ({
    ...userActions,
    id: userActions.id.toString(),
  }));}

  const acceptedUserActions = (inVal) => { 
    return formatedUserActions(inVal)
    .filter((action) => action.status !== true)
    .map((action) => ({ ...action }));
  }
  const doneUserActions = (inVal) => {
    return formatedUserActions(inVal)
    .filter((action) => action.status !== false)
    .map((action) => ({ ...action }));}

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
  const [columns, setColumns] = useState(
    columnUserActions(acceptedUserActions(totUserActions), doneUserActions(totUserActions))
  );
   //******************************************************* */
  return (
    <>
      <CarouselContainer
        user={user}
        actionsWithUserActions={JSON.parse(actionsWithUserActions)}
        actionsWithoutUserActions={JSON.parse(actionsWithoutUserActions)}
        addAcceptedAction={addAcceptedAction}
        deletedAction={deletedAction}
      />

      <KanbanActionContainer
        setLocalAccepted={setLocalAccepted}
        columns = {columns}
        setColumns = {setColumns}
        setTotUserActions = {setTotUserActions}
      />
    </>
  );
};
export default ClimateActionsContainer;
