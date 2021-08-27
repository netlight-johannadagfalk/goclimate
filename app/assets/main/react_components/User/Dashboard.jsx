import React, { useState, useEffect } from "react";
import ClimateActionsContainer from "./ClimateActionsContainer.jsx";
//*** The ContextProvider needs to be imported  */
import { CategoryProvider } from "./contexts/CategoryContext.js";
import { DeletedActionProvider } from "./contexts/DeletedActionContext.js";
import { UserActionsProvider } from "./contexts/UserActionsContext.js";

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
          <ClimateActionsContainer
            user={user}
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
