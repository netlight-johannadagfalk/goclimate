import React, { useState, useEffect } from "react";
import ClimateActionsContainer from "./ClimateActionsContainer.jsx";
//*** The ContextProvider needs to be imported  */
import { CategoryProvider } from "./contexts/CategoryContext.js";
import { DeletedActionProvider } from "./contexts/DeletedActionContext.js";
import { UserActionsProvider } from "./contexts/UserActionsContext.js";
import { ClimateActionsProvider } from "./contexts/ClimateActionsContext.js";

const Dashboard = ({
  user,
  allUserActions,
  actionsWithUserActions,
  actionsWithoutUserActions,
  climateActionCategories,
}) => {
  return (
    //   ContextProvider provides the context to all its children
    <DeletedActionProvider>
      <CategoryProvider>
        <UserActionsProvider allUserActions={JSON.parse(allUserActions)}>
          <ClimateActionsProvider
            actionsWithUserActions={actionsWithUserActions}
            actionsWithoutUserActions={actionsWithoutUserActions}
          >
            <ClimateActionsContainer
              user={user}
              climateActionCategories={climateActionCategories}
            ></ClimateActionsContainer>
          </ClimateActionsProvider>
        </UserActionsProvider>
      </CategoryProvider>
    </DeletedActionProvider>
  );
};

export default Dashboard;
