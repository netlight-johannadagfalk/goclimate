import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import CarouselActionItem from "./CarouselActionItem.jsx";

// Carousel resources
// https://github.com/leandrowd/react-responsive-carousel
// http://react-responsive-carousel.js.org/storybook/index.html?path=/story/01-basic--with-custom-status-arrows-and-indicators
// http://react-responsive-carousel.js.org/storybook/?path=/story/02-advanced--with-external-controls

const CarouselList = ({
  user,
  actionsWithUserActions,
  actionsWithoutUserActions,
  addAcceptedAction,
  deletedAction,
  category,
}) => {
  useEffect(() => {
    const filteredActions = category
      ? totClimateActions.filter(
          (temp) => temp.climate_action_category_id === category
        )
      : totClimateActions;
    setClimateActionsUser(filteredActions);

    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction, category]);
  const localActionsWithUserActions = actionsWithUserActions.map((action) => ({
    ...action,
    accepted: true,
  }));
  const localActionsWithoutUserActions = actionsWithoutUserActions.map(
    (action) => ({
      ...action,
      accepted: false,
    })
  );

  const totClimateActions = [
    ...localActionsWithoutUserActions,
    ...localActionsWithUserActions,
  ];
  const [climateActionsUser, setClimateActionsUser] = useState([
    ...totClimateActions,
  ]);

  const updateLocalAccepted = (actionID) => {
    setClimateActionsUser(
      climateActionsUser.map((action) =>
        action.id === actionID
          ? { ...action, accepted: !action.accepted }
          : action
      )
    );
  };

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
          setClimateActionsUser={setClimateActionsUser}
          updateLocalAccepted={updateLocalAccepted}
          addAcceptedAction={addAcceptedAction}
        ></CarouselActionItem>
      ))}
    </Carousel>
  );
};

export default CarouselList;
