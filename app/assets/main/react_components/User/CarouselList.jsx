import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import CarouselActionItem from "./CarouselActionItem.jsx";

// Carousel resources
// https://github.com/leandrowd/react-responsive-carousel
// http://react-responsive-carousel.js.org/storybook/index.html?path=/story/01-basic--with-custom-status-arrows-and-indicators
// http://react-responsive-carousel.js.org/storybook/?path=/story/02-advanced--with-external-controls

const CarouselList = ({ user, climateActionsUser, updateLocalAccepted, addAcceptedAction, }) => {
  return (
    <Carousel
      centerMode={true}
      centerSlidePercentage={25}
      showThumbs={false}
      showStatus={false}
      infiniteLoop={false}
      showIndicators={false}
      autoPlay={false}
      showArrows={false}
      renderArrowPrev={
        (onClickHandler, hasPrev) => (
          //hasPrev && (
          <button
            type="button"
            className="button absolute border-none shadow-none bottom-0 focus:outline-none fas fa-arrow-circle-left"
            onClick={onClickHandler}
          ></button>
        )
        //)
      }
      renderArrowNext={
        (onClickHandler, hasNext) => (
          //hasNext && (
          <button
            type="button"
            className="button border-none shadow-none float-right focus:outline-none fas fa-arrow-circle-right"
            onClick={onClickHandler}
          ></button>
        )
        //)
      }
    >
      {climateActionsUser.map((action) => (
        <CarouselActionItem
          action={action}
          key={action.id}
          user={user}
          updateLocalAccepted={updateLocalAccepted}
          addAcceptedAction={addAcceptedAction}
        ></CarouselActionItem>
      ))}
    </Carousel>
  );
};

export default CarouselList;
