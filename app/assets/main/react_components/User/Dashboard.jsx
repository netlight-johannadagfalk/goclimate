import React, { useState, useEffect } from "react";
import ClimateActionsContainer from "./ClimateActionsContainer.jsx";
//*** The ContextProvider needs to be imported  */
import { CategoryProvider } from "./contexts/CategoryContext.js";
import { DeletedActionProvider } from "./contexts/DeletedActionContext.js";
import { UserActionsProvider } from "./contexts/UserActionsContext";

const Dashboard = ({
  user,
  allUserActions,
  actionsWithUserActions,
  actionsWithoutUserActions,
  climateActionCategories,
}) => {
  //Sätta värde på context från props

  return (
    //   ContextProvider provides the context to all its children
    <DeletedActionProvider>
      <CategoryProvider>
        <UserActionsProvider>
          <ClimateActionsContainer
            user={user}
            allUserActions={allUserActions}
            actionsWithUserActions={actionsWithUserActions}
            actionsWithoutUserActions={actionsWithoutUserActions}
            climateActionCategories={climateActionCategories}
          ></ClimateActionsContainer>
        </UserActionsProvider>
      </CategoryProvider>
    </DeletedActionProvider>
  );
};

export default Dashboard;
