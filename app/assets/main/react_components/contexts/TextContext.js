import React, { useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const DashboardTextContext = React.createContext();
const ClimateActionsTextContext = React.createContext();
const LifestyleFootprintTextContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useDashboardText = () => {
  return useContext(DashboardTextContext);
};

export const useClimateActionsText = () => {
  return useContext(ClimateActionsTextContext);
};

export const useLifestyleFootprintText = () => {
  return useContext(LifestyleFootprintTextContext);
};

//***  To wrap components that need acces to the context in ***/
export const TextProvider = ({
  children,
  dashboardText,
  climateActionsText,
  lifestyleFootprintText,
}) => {
  //   const dashboardText = JSON.parse(dashboardText);

  return (
    <DashboardTextContext.Provider value={dashboardText}>
      <ClimateActionsTextContext.Provider value={climateActionsText}>
        <LifestyleFootprintTextContext.Provider value={lifestyleFootprintText}>
          {children}
        </LifestyleFootprintTextContext.Provider>
      </ClimateActionsTextContext.Provider>
    </DashboardTextContext.Provider>
  );
};
