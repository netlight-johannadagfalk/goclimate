import React from "react";
import CarouselHeader from "./CarouselHeader.jsx";
import CarouselList from "./CarouselList.jsx";

const CarouselContainer = ({
  user,
  climateActionsUser,
  updateLocalAccepted,
  addAcceptedAction,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2">
      <CarouselHeader />
      <CarouselList
        user={user}
        climateActionsUser={climateActionsUser}
        updateLocalAccepted={updateLocalAccepted}
        addAcceptedAction={addAcceptedAction}
      ></CarouselList>
    </div>
  );
};

export default CarouselContainer;
