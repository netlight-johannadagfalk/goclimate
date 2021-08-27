import React, { useState, useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const ClimateActionsContext = React.createContext();
const ClimateActionsUpdateContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useClimateActions = () => {
  return useContext(ClimateActionsContext);
};

export const useClimateActionsUpdate = () => {
  return useContext(ClimateActionsUpdateContext);
};

//***  To wrap components that need acces to the context in ***/
export const ClimateActionsProvider = ({ children }) => {
  const [climateActions, setClimateActions] = useState(null);

  const updateClimateActions = (cat) => {
    setClimateActions(cat);
  };

  return (
    <ClimateActionsContext.Provider value={climateActions}>
      <ClimateActionsUpdateContext.Provider value={updateClimateActions}>
        {children}
      </ClimateActionsUpdateContext.Provider>
    </ClimateActionsContext.Provider>
  );
};
