import React from "react";
import ClimateActionsContainer from "./ClimateActionsContainer.jsx";
import { CategoryProvider } from "../contexts/CategoryContext.js";
import { DeletedActionProvider } from "../contexts/DeletedActionContext.js";
import { UserActionsProvider } from "../contexts/UserActionsContext.js";
import { ClimateActionsProvider } from "../contexts/ClimateActionsContext.js";

const Dashboard = ({
  user,
  allUserActions,
  actionsWithUserActions,
  actionsWithoutUserActions,
  climateActionCategories,
  footprint,
  commonText,
  countryAverage,
  modelText,
  lang,
  registrationsText,
  totalNoFootprints,
}) => {
  return (
    <DeletedActionProvider>
      <CategoryProvider>
        <UserActionsProvider
          allUserActions={JSON.parse(allUserActions)}
          actionsWithoutUserActions={actionsWithoutUserActions}
          actionsWithUserActions={actionsWithUserActions}
          climateActionCategories={climateActionCategories}
        >
          <ClimateActionsProvider
            actionsWithUserActions={actionsWithUserActions}
            actionsWithoutUserActions={actionsWithoutUserActions}
          >
            <ClimateActionsContainer
              user={user}
              climateActionCategories={climateActionCategories}
              footprint={footprint}
              commonText={commonText}
              countryAverage={countryAverage}
              modelText={modelText}
              lang={lang}
              registrationsText={registrationsText}
              totalNoFootprints={totalNoFootprints}
            ></ClimateActionsContainer>
          </ClimateActionsProvider>
        </UserActionsProvider>
      </CategoryProvider>
    </DeletedActionProvider>
  );
};

export default Dashboard;
