import React, { useState, useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const MobileKanbanContext = React.createContext();
const MobileKanbanUpdateContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useMobileKanban = () => {
  return useContext(MobileKanbanContext);
};

export const useMobileKanbanUpdate = () => {
  return useContext(MobileKanbanUpdateContext);
};

//***  To wrap components that need acces to the context in ***/
export const MobileKanbanProvider = ({ children }) => {
  const [showMobileKanban, setShowMobileKanban] = useState(false);

  const updateMobileKanban = (bool) => {
    setShowMobileKanban(bool);
  };

  return (
    <MobileKanbanContext.Provider value={showMobileKanban}>
      <MobileKanbanUpdateContext.Provider value={updateMobileKanban}>
        {children}
      </MobileKanbanUpdateContext.Provider>
    </MobileKanbanContext.Provider>
  );
};
