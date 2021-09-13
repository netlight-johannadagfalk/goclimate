import React from "react";
import CarouselActionItem from "../dashboard/climate_actions/carousel/CarouselActionItem.jsx";

const MonthlyAction = ({ action, user, updateLocalAccepted, categories }) => {
  return (
    <div className="w-64 ml-10 mt-11 relative">
      <h3 className="heading text-center">Action of the Month </h3>
      <CarouselActionItem
        action={action}
        key={action.id}
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={categories}
      ></CarouselActionItem>
      {/* <div
        className="h-7 w-7 top-20 left-6 bg-cover absolute"
        style={{
          backgroundImage:
            "url('/achievement_images/AchievementStarActive.png')",
        }}
      ></div> */}

      <div className="h-80 w-80 top-2 bg-cover absolute">
        <svg viewBox="0 0 600 600">
          <path
            id="curve"
            fill="transparent"
            d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"
          />
          <text width="600" fontSize="35">
            <textPath xlinkHref="#curve">
              ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default MonthlyAction;
