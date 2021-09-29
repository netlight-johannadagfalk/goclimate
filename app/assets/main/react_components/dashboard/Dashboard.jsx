import React from 'react';
import ClimateActionsContainer from './climate_actions/ClimateActionsContainer.jsx';
import { CategoryProvider } from '../contexts/CategoryContext.js';
import { DeletedActionProvider } from '../contexts/DeletedActionContext.js';
import { ClimateActionsProvider } from '../contexts/ClimateActionsContext.js';
import { FootprintProvider } from '../contexts/FootprintContext.js';
import { TextProvider } from '../contexts/TextContext.js';
import { UserProvider } from '../contexts/UserContext.js';

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
            actionsWithoutUserActions={JSON.parse(actionsWithoutUserActions)}
            actionsWithUserActions={JSON.parse(actionsWithUserActions)}
            climateActionCategories={JSON.parse(climateActionCategories)}
            userSubscriptionType={JSON.parse(userSubscriptionType)}
          >
            <ClimateActionsProvider
              actionsWithUserActions={JSON.parse(actionsWithUserActions)}
              actionsWithoutUserActions={JSON.parse(actionsWithoutUserActions)}
            >
              <FootprintProvider
                footprint={JSON.parse(footprint)}
                commonText={JSON.parse(commonText)}
                countryAverage={JSON.parse(countryAverage)}
                modelText={JSON.parse(modelText)}
                lang={lang}
                registrationsText={JSON.parse(registrationsText)}
                totalNoFootprints={totalNoFootprints}
              >
                <ClimateActionsContainer
                  user={JSON.parse(user)}
                  climateActionCategories={JSON.parse(climateActionCategories)}
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
