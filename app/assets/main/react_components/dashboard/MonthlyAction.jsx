import React from "react";
import CarouselActionItem from "./carousel/CarouselActionItem.jsx";

const MonthlyAction = ({ action, user, updateLocalAccepted, categories }) => {
  return (
    <div className="w-64 ml-10 mt-11">
      <h3 className="heading text-center">Action of the Month </h3>
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
