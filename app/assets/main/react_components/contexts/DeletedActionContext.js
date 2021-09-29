import React, { useState, useContext } from 'react';

const DeletedActionContext = React.createContext();
const DeletedActionUpdateContext = React.createContext();

export const useDeletedAction = () => {
  return useContext(DeletedActionContext);
};

export const useDeletedActionUpdate = () => {
  return useContext(DeletedActionUpdateContext);
};

export const DeletedActionProvider = ({ children }) => {
  const [deletedAction, setDeletedAction] = useState(null);

  return (
    <DeletedActionContext.Provider value={deletedAction}>
      <DeletedActionUpdateContext.Provider value={setDeletedAction}>
        {children}
      </DeletedActionUpdateContext.Provider>
    </DeletedActionContext.Provider>
  );
};
