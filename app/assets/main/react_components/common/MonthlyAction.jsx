import React from "react";
import CarouselActionItem from "../dashboard/climate_actions/carousel/CarouselActionItem.jsx";
import { useClimateActionsText } from "../contexts/TextContext.js";
import TextBanner from "./TextBanner.jsx";

const MonthlyAction = ({ action, user, updateLocalAccepted, categories }) => {
  const climateActionsText = useClimateActionsText();
  const text = climateActionsText.monthly_action;
  return (
    <div className="w-64 ml-10 mt-11 relative">
      <CarouselActionItem
        action={action}
        key={action.id}
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={categories}
        monthlyActionBanner={true}
      ></CarouselActionItem>

      <div className="h-52 w-52 -top-4 left-6 bg-cover absolute">
        <TextBanner text={text} />
      </div>
    </div>
  );
};

export default MonthlyAction;
