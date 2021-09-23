import React from "react";
import ClimateActionsContainer from "./climate_actions/ClimateActionsContainer.jsx";
import { CategoryProvider } from "../contexts/CategoryContext.js";
import { DeletedActionProvider } from "../contexts/DeletedActionContext.js";
import { ClimateActionsProvider } from "../contexts/ClimateActionsContext.js";
import { FootprintProvider } from "../contexts/FootprintContext.js";
import { TextProvider } from "../contexts/TextContext.js";
import { UserProvider } from "../contexts/UserContext.js";

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
  climateActionsText,
  totalNoFootprints,
  userSubscriptionType,
  actionsToplist,
}) => {
  return (
    <TextProvider climateActionsText={JSON.parse(climateActionsText)}>
      <DeletedActionProvider>
        <CategoryProvider>
          <UserProvider
            allUserActions={JSON.parse(allUserActions)}
            actionsWithoutUserActions={actionsWithoutUserActions}
            actionsWithUserActions={actionsWithUserActions}
            climateActionCategories={climateActionCategories}
            userSubscriptionType={userSubscriptionType}
          >
            <ClimateActionsProvider
              actionsWithUserActions={actionsWithUserActions}
              actionsWithoutUserActions={actionsWithoutUserActions}
            >
              <FootprintProvider
                footprint={footprint}
                commonText={commonText}
                countryAverage={countryAverage}
                modelText={modelText}
                lang={lang}
                registrationsText={registrationsText}
                totalNoFootprints={totalNoFootprints}
              >
                <ClimateActionsContainer
                  user={user}
                  climateActionCategories={climateActionCategories}
                  actionsToplist={JSON.parse(actionsToplist)}
                ></ClimateActionsContainer>
              </FootprintProvider>
            </ClimateActionsProvider>
          </UserProvider>
        </CategoryProvider>
      </DeletedActionProvider>
    </TextProvider>
  );
};

export default Dashboard;
