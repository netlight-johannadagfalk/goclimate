import React, { useEffect, useState } from "react";
import CarouselContainer from "./CarouselContainer.jsx";
// import CarouselActionItem from "./CarouselActionItem.jsx";
import { useDeletedAction } from "./contexts/DeletedActionContext.js";
import {
  useClimateActions,
  useClimateActionsUpdate,
  useClimateActionsOriginal,
} from "./contexts/ClimateActionsContext.js";
import Sidebar from "./Sidebar.jsx";
import MainInfo from "./MainInfo.jsx";

const ClimateActionsContainer = ({
  user,
  climateActionCategories,
  footprint,
  commonText,
}) => {
  const deletedAction = useDeletedAction();
  const climateActions = useClimateActions();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();

  const [monthlyAction, setMonthlyAction] = useState(
    totClimateActions.find((action) => action.action_of_the_month === true)
  );

  const updateLocalAccepted = (actionID) => {
    setClimateActions(
      climateActions.map((action) =>
        action.id === actionID
          ? { ...action, accepted: !action.accepted }
          : action
      )
    );
    monthlyAction.id === actionID &&
      setMonthlyAction({ ...monthlyAction, accepted: !monthlyAction.accepted });
  };

  // categoryColor should be something like monthlyAction.climate_action_category_id.toString()), or map the id to a category name matching the category_colors.css file naming (that cannot be numbers)
  const categoryColor = "category_housing";

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  return (
    <>
      <MainInfo
        footprint={footprint}
        commonText={commonText}
        action={monthlyAction}
        // key={monthlyAction.id}
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={JSON.parse(climateActionCategories)}
      ></MainInfo>
      {/* <div className="section-padding space-y-12 t:space-y-6 relative mx-auto mt-4 h-96">
        <div className="left-0 absolute top-0">
          <FootprintContainer
            footprint={footprint}
            commonText={commonText}
          ></FootprintContainer>
        </div>
        <div className="w-80 mx-auto space-y-3 t:p-8 right-0 absolute top-0">
          <h3 className="heading">Action of the Month </h3>
          {monthlyAction && (
            <CarouselActionItem
              action={monthlyAction}
              key={monthlyAction.id}
              user={user}
              updateLocalAccepted={updateLocalAccepted}
              categories={JSON.parse(climateActionCategories)}
            ></CarouselActionItem>
          )}
        </div>
      </div> */}

      <CarouselContainer
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        climateActionCategories={climateActionCategories}
        categoryColor={categoryColor}
      />

      <Sidebar categoryColor={categoryColor} />
    </>
  );
};
export default ClimateActionsContainer;
