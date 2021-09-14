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

      <div className="h-60 w-60 -top-40 left-10 bg-cover absolute">
        <svg viewBox="0 0 60 60">
          <path
            id="curve"
            fill="transparent"
            d="M 00 60 C 10 40, 30 40, 40 60"
          />
          <text width="100" fontSize="4">
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
