import React from "react";
import CarouselActionItem from "./CarouselActionItem.jsx";
import { useClimateActions } from "../../../contexts/ClimateActionsContext.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import { orderBy } from "lodash";
import { useMediaQuery } from "react-responsive";
import { m, t, d, dMd } from "../../../constants";

// Swiper resources
//https://swiperjs.com/react
//https://swiperjs.com/swiper-api#parameters

import SwiperCore, { Navigation, Pagination, Scrollbar } from "swiper/core";
SwiperCore.use([Pagination, Navigation, Scrollbar]);

const CarouselList = ({ user, updateLocalAccepted, categories }) => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  const climateActions = useClimateActions();
  const isMobile = useMediaQuery({ query: `(max-width: ${m})` });
  const isTablet = useMediaQuery({ query: `(max-width: ${t})` });
  const isLargeTablet = useMediaQuery({ query: `(max-width: ${d})` });
  const isDesktop = useMediaQuery({ query: `(max-width: ${dMd})` });

  const sortForMobileClimateActions = orderBy(
    climateActions,
    ["action_of_the_month"],
    ["desc"]
  );

  const actions = isMobile ? sortForMobileClimateActions : climateActions;

  return (
    <div className="relative overflow-visible">
      <Swiper
        className="m-4"
        slidesPerView={
          isMobile
            ? 1.5
            : isTablet
            ? 2.5
            : isLargeTablet
            ? 3
            : isDesktop
            ? 3.5
            : 4
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
          <SwiperSlide
            key={action.id}
            className={"min-h-full mb-10"}
            style={{
              height: "auto",
            }}
          >
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
