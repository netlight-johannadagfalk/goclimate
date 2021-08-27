import React, { useState, useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const UserActionsContext = React.createContext();
const UserActionsUpdateContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useUserActions = () => {
  return useContext(UserActionsContext);
};

export const useUserActionsUpdate = () => {
  return useContext(UserActionsUpdateContext);
};

//***  To wrap components that need acces to the context in ***/
export const UserActionsProvider = ({ children }) => {
  const [userActions, setUserActions] = useState(null);

  const updateUserActions = (cat) => {
    setUserActions(cat);
  };

  return (
    <UserActionsContext.Provider value={userActions}>
      <UserActionsUpdateContext.Provider value={updateUserActions}>
        {children}
      </UserActionsUpdateContext.Provider>
    </UserActionsContext.Provider>
  );
};
