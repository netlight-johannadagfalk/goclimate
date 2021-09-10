import React, { useState, useContext } from "react";
import { shuffle } from "lodash";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const ClimateActionsContext = React.createContext();
const ClimateActionsUpdateContext = React.createContext();
const ClimateActionsContextOriginal = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useClimateActions = () => {
  return useContext(ClimateActionsContext);
};

export const useClimateActionsUpdate = () => {
  return useContext(ClimateActionsUpdateContext);
};

export const useClimateActionsOriginal = () => {
  return useContext(ClimateActionsContextOriginal);
};

//***  To wrap components that need acces to the context in ***/
export const ClimateActionsProvider = ({
  children,
  actionsWithUserActions,
  actionsWithoutUserActions,
}) => {
  const localActionsWithUserActions = JSON.parse(actionsWithUserActions).map(
    (action) => ({
      ...action,
      accepted: true,
    })
  );

  const localActionsWithoutUserActions = JSON.parse(
    actionsWithoutUserActions
  ).map((action) => ({
    ...action,
    accepted: false,
  }));

  const shuffledActionsWithoutUserActions = shuffle(
    localActionsWithoutUserActions
  );

  const totClimateActions = [
    ...shuffledActionsWithoutUserActions,
    ...localActionsWithUserActions,
  ];

  const [climateActions, setClimateActions] = useState([...totClimateActions]);

  const updateClimateActions = (cat) => {
    setClimateActions(cat);
  };

  return (
    <ClimateActionsContext.Provider value={climateActions}>
      <ClimateActionsUpdateContext.Provider value={updateClimateActions}>
        <ClimateActionsContextOriginal.Provider value={totClimateActions}>
          {children}
        </ClimateActionsContextOriginal.Provider>
      </ClimateActionsUpdateContext.Provider>
    </ClimateActionsContext.Provider>
  );
};
