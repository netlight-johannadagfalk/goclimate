import React, { useState, useEffect } from "react";
import ClimateActionsContainer from "./ClimateActionsContainer.jsx";
//*** The ContextProvider needs to be imported  */
import { CategoryProvider } from "./contexts/CategoryContext.js";
import { DeletedActionProvider } from "./contexts/DeletedActionContext.js";

const Dashboard = ({
  user,
  userActions,
  actionsWithUserActions,
  actionsWithoutUserActions,
  climateActionCategories,
}) => {
  //Sätta värde på context från props

  return (
    //   ContextProvider provides the context to all its children
    <DeletedActionProvider>
      <CategoryProvider>
        <ClimateActionsContainer
          user={user}
          userActions={userActions}
          actionsWithUserActions={actionsWithUserActions}
          actionsWithoutUserActions={actionsWithoutUserActions}
          climateActionCategories={climateActionCategories}
        ></ClimateActionsContainer>
      </CategoryProvider>
    </DeletedActionProvider>
  );
};

export default Dashboard;
