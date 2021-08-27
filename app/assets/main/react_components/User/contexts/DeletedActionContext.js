import React, { useState, useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const DeletedActionContext = React.createContext();
const DeletedActionUpdateContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useDeletedAction = () => {
  return useContext(DeletedActionContext);
};

export const useDeletedActionUpdate = () => {
  return useContext(DeletedActionUpdateContext);
};

//***  To wrap components that need acces to the context in ***/
export const DeletedActionProvider = ({ children }) => {
  const [deletedAction, setDeletedAction] = useState(null);

  const updateDeletedAction = (action) => {
    setDeletedAction(action);
  };

  return (
    <DeletedActionContext.Provider value={deletedAction}>
      <CategoryUpdateContext.Provider value={updateDeletedAction}>
        {children}
      </CategoryUpdateContext.Provider>
    </DeletedActionContext.Provider>
  );
};
