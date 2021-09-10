import React from "react";
import CarouselActionItem from "./CarouselActionItem.jsx";
import { useClimateActions } from "./contexts/ClimateActionsContext.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import { orderBy } from "lodash";
import { useMediaQuery } from "react-responsive";

// Swiper resources
//https://swiperjs.com/react
//https://swiperjs.com/swiper-api#parameters

import SwiperCore, { Navigation, Pagination, Scrollbar } from "swiper/core";
SwiperCore.use([Pagination, Navigation, Scrollbar]);

const CarouselList = ({ user, updateLocalAccepted, categories }) => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  const climateActions = useClimateActions();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const sortForMobileClimateActions = orderBy(
    climateActions,
    ["action_of_the_month"],
    ["desc"]
  );

  const actions = isTabletOrMobile
    ? sortForMobileClimateActions
    : climateActions;

  return (
    <div className="overflow-visible">
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
        {actions.map((action) => (
          <SwiperSlide
            key={action.id}
            className={"h-auto min-h-full mb-10 overflow-visible"}
          >
            <CarouselActionItem
              action={action}
              user={user}
              updateLocalAccepted={updateLocalAccepted}
              categories={categories}
            ></CarouselActionItem>
          </SwiperSlide>
        ))}
        <div className="flex flex-row justify-between absolute z-50 top-1/2 w-full overflow-visible">
          <div
            ref={navigationPrevRef}
            className={
              "-ml-6 rounded-full h-12 w-12 bg-white border border-gray-accent fas fa-chevron-left "
            }
          />
          <div
            ref={navigationNextRef}
            className={
              "-mr-6 rounded-full h-12 w-12 bg-white border border-gray-accent fas fa-chevron-right "
            }
          />
        </div>
      </Swiper>
    </div>
  );
};

export default CarouselList;
