import React from "react";
import CarouselActionItem from "../dashboard/climate_actions/carousel/CarouselActionItem.jsx";
import { useClimateActionsText } from "../contexts/TextContext.js";

const MonthlyAction = ({ action, user, updateLocalAccepted, categories }) => {
  const climateActionsText = useClimateActionsText();

  return (
    <div className="w-64 ml-10 mt-11">
      <h3 className="heading text-center">
        {climateActionsText.monthly_action}
      </h3>
      <CarouselActionItem
        action={action}
        key={action.id}
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={categories}
      ></CarouselActionItem>
    </div>
  );
};

export default MonthlyAction;
