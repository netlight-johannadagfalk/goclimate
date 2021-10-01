import React, { useContext } from 'react';

const ClimateActionsTextContext = React.createContext(undefined);

const TextProvider = ({ children, climateActionsText }) => {
  return (
    <ClimateActionsTextContext.Provider value={climateActionsText}>
      {children}
    </ClimateActionsTextContext.Provider>
  );
};

const useClimateActionsText = () => {
  const context = useContext(ClimateActionsTextContext);
  if (!context) {
    throw new Error(
      'Please wrap component in FootprintProvider to use useFootprint'
    );
  }

  return context;
};

export { TextProvider, useClimateActionsText };
