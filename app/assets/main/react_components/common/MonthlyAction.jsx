import React from "react";
import CarouselActionItem from "../dashboard/climate_actions/carousel/CarouselActionItem.jsx";
import { useClimateActionsText } from "../contexts/TextContext.js";

const MonthlyAction = ({ action, user, updateLocalAccepted, categories }) => {
  const climateActionsText = useClimateActionsText();

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

      <div className="h-64 w-64 -top-12 left-0 bg-cover absolute">
        <svg viewBox="0 0 150 150">
          <path
            id="curve"
            fill="transparent"
            d="M 20 90 C 20 15, 130 15, 130 90"
          />
          <text className="green-primary text-sm font-thin">
            <textPath xlinkHref="#curve">
              &nbsp; &nbsp; &nbsp; &nbsp; {climateActionsText.monthly_action}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default MonthlyAction;
