import React, { useState, useEffect } from "react";
import ClimateActionsContainer from "./ClimateActionsContainer.jsx";
//*** The ContextProvider needs to be imported  */
import { CategoryProvider } from "./contexts/CategoryContext.js";

const Dashboard = ({
  user,
  userActions,
  actionsWithUserActions,
  actionsWithoutUserActions,
  climateActionCategories,
}) => {
  return (
    //   ContextProvider provides the context to all its children
    <CategoryProvider>
      <ClimateActionsContainer
        user={user}
        userActions={userActions}
        actionsWithUserActions={actionsWithUserActions}
        actionsWithoutUserActions={actionsWithoutUserActions}
        climateActionCategories={climateActionCategories}
      ></ClimateActionsContainer>
    </CategoryProvider>
  );
};

export default Dashboard;
