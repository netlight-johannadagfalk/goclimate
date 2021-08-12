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

    setTotUserActions([...totUserActions, temp]);
  };

  const setLocalAccepted = (updatedList, deletedAction) => {
    setTotUserActions(updatedList);
    setDeletedAction(deletedAction);
  };

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
        userActions={totUserActions}
        setLocalAccepted={setLocalAccepted}
      />
    </>
  );
};
export default ClimateActionsContainer;
