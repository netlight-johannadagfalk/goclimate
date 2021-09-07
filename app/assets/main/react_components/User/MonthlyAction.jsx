import React from "react";
import CarouselActionItem from "./CarouselActionItem.jsx";

const MonthlyAction = ({ action, user, updateLocalAccepted, categories }) => {
  // Kolla om Monthly action finns!
  return (
    <div className="w-64 mx-auto space-y-3 right-0 absolute bottom-0">
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
