import React, { useState, useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
export const UserActionsContext = React.createContext();
export const UserActionsUpdateContext = React.createContext();
export const UserActionsColumnsContext = React.createContext();
export const UserActionsColumnsUpdateContext = React.createContext();
export const UserActionsColumnsWithFormatUpdateContext = React.createContext();
export const UserActionsColumnsWithFullFormatUpdeateContext =
  React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useUserActions = () => {
  return useContext(UserActionsContext);
};

export const useUserActionsUpdate = () => {
  return useContext(UserActionsUpdateContext);
};

export const useUserActionsColumns = () => {
  return useContext(UserActionsColumnsContext);
};
export const useUserActionsColumnsUpdate = () => {
  return useContext(UserActionsColumnsUpdateContext);
};
export const useUserActionsColumnsWithFormatUpdate = () => {
  return useContext(UserActionsColumnsWithFormatUpdateContext);
};

export const useUserActionsColumnsWithFullFormatUpdate = () => {
  return useContext(UserActionsColumnsWithFullFormatUpdeateContext);
};
//***  To wrap components that need acces to the context in ***/
export const UserActionsProvider = ({ children, allUserActions }) => {
  const [userActions, setUserActions] = useState(allUserActions);

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

  const updateUserActions = (actions) => {
    setUserActions(actions);
  };

  const updateColumns = (inVal) => {
    setColumns(inVal);
  };
  const updateColumnsWithFormat = (updatedList, performedList) => {
    setColumns(columnUserActions(updatedList, performedList));
  };
  const updateColumnsWithFullFormat = (inVal) => {
    setColumns(
      columnUserActions(acceptedUserActions(inVal), doneUserActions(inVal))
    );
  };

  return (
    <UserActionsContext.Provider value={userActions}>
      <UserActionsUpdateContext.Provider value={updateUserActions}>
        <UserActionsColumnsContext.Provider value={columns}>
          <UserActionsColumnsUpdateContext.Provider value={updateColumns}>
            <UserActionsColumnsWithFormatUpdateContext.Provider
              value={updateColumnsWithFormat}
            >
              <UserActionsColumnsWithFullFormatUpdeateContext.Provider
                value={updateColumnsWithFullFormat}
              >
                {children}
              </UserActionsColumnsWithFullFormatUpdeateContext.Provider>
            </UserActionsColumnsWithFormatUpdateContext.Provider>
          </UserActionsColumnsUpdateContext.Provider>
        </UserActionsColumnsContext.Provider>
      </UserActionsUpdateContext.Provider>
    </UserActionsContext.Provider>
  );
};
