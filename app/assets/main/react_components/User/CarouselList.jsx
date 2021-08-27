import React from "react";
import CarouselActionItem from "./CarouselActionItem.jsx";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";

import { useClimateActions } from "./contexts/ClimateActionsContext.js";

// Swiper resources
//https://swiperjs.com/react
//https://swiperjs.com/swiper-api#parameters

import SwiperCore, { Navigation, Pagination, Scrollbar } from "swiper/core";
SwiperCore.use([Pagination, Navigation, Scrollbar]);

const CarouselList = ({ user, updateLocalAccepted, addAcceptedAction }) => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  const climateActions = useClimateActions();
  return (
    <>
      <Swiper
        slidesPerView={4}
        navigation={{
          nextEl: navigationPrevRef.current,
          prevEl: navigationNextRef.current,
        }}
        pagination={true}
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            swiper.params.navigation.nextEl = navigationNextRef.current;
            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
          });
        }}
      >
        {climateActions.map((action) => (
          <SwiperSlide key={action.id} className={"h-auto min-h-full mb-10"}>
            <CarouselActionItem
              action={action}
              user={user}
              updateLocalAccepted={updateLocalAccepted}
              addAcceptedAction={addAcceptedAction}
            ></CarouselActionItem>
          </SwiperSlide>
        ))}
        <div className="flex flex-row justify-between absolute z-10 top-1/2 w-full">
          <div
            ref={navigationPrevRef}
            className={
              "button border-none shadow-none focus:outline-none fas fa-arrow-left"
            }
          />
          <div
            ref={navigationNextRef}
            className={
              "button border-none shadow-none focus:outline-none fas fa-arrow-right"
            }
          />
        </div>
      </Swiper>
    </>
  );
};

export default CarouselList;
