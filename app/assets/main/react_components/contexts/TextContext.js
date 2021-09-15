import React, { useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const ClimateActionsTextContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/

export const useClimateActionsText = () => {
  return useContext(ClimateActionsTextContext);
};

//***  To wrap components that need acces to the context in ***/
export const TextProvider = ({ children, climateActionsText }) => {
  return (
    <ClimateActionsTextContext.Provider value={climateActionsText}>
      {children}
    </ClimateActionsTextContext.Provider>
  );
};
