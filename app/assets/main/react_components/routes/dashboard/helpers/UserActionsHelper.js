export const formatedUserActions = (inVal) => {
  return inVal.map((userActions) => ({
    ...userActions,
    id: userActions.id.toString()
  }));
};

export const acceptedUserActions = (inVal) => {
  return formatedUserActions(inVal)
    .filter((action) => action.status !== true)
    .map((action) => ({ ...action }));
};

export const columnUserActions = (
  acceptedList,
  doneList,
  climateActionsText
) => {
  return {
    [1]: {
      id: 'Accepted',
      name: climateActionsText.my_actions,
      items: acceptedList
    },
    [2]: {
      id: 'Performed',
      name: climateActionsText.achievements,
      items: doneList
    }
  };
};

export const findAcceptedUserActions = (actions) => {
  let actionsAccepted = 0;

  actions.map((action) => {
    if (action.status === false) {
      actionsAccepted++;
    }
  });
  return actionsAccepted;
};
