import React from "react";
import CarouselHeader from "./CarouselHeader.jsx";
import CarouselList from "./CarouselList.jsx";

const CarouselContainer = ({
  user,
  climateActionsUser,
  updateLocalAccepted,
  addAcceptedAction,
  categoryColor,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-3 ">
      <CarouselHeader />
      <CarouselList
        user={user}
        climateActionsUser={climateActionsUser}
        updateLocalAccepted={updateLocalAccepted}
        addAcceptedAction={addAcceptedAction}
        categoryColor={categoryColor}
      ></CarouselList>
    </div>
  );
};

export default CarouselContainer;
