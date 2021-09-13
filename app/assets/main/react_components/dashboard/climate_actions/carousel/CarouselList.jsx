import React from "react";
import CarouselActionItem from "./CarouselActionItem.jsx";
import { useClimateActions } from "../../../contexts/ClimateActionsContext.js";
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
  const isMobile = useMediaQuery({ query: "(max-width: 414px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
  const isLargeTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  const sortForMobileClimateActions = orderBy(
    climateActions,
    ["action_of_the_month"],
    ["desc"]
  );

  const actions = isMobile ? sortForMobileClimateActions : climateActions;

  return (
    <div className="relative">
      <Swiper
        className="m-4"
        slidesPerView={
          isMobile ? 1.5 : isTablet ? 2.5 : isLargeTablet ? 3.5 : 4
        }
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
          <SwiperSlide key={action.id} className={"h-auto min-h-full mb-10"}>
            <CarouselActionItem
              action={action}
              user={user}
              updateLocalAccepted={updateLocalAccepted}
              categories={categories}
            ></CarouselActionItem>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex flex-row absolute z-10 top-1/2 w-full">
        <div className="relative w-full">
          <button
            ref={navigationPrevRef}
            className={
              "rounded-full -left-6 h-12 w-12 bg-white border border-gray-accent fas fa-chevron-left absolute focus:outline-none"
            }
          />
          <button
            ref={navigationNextRef}
            className={
              "rounded-full -right-6 h-12 w-12 bg-white border border-gray-accent fas fa-chevron-right absolute focus:outline-none"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CarouselList;
