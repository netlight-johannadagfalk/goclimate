import React from "react";
import CarouselActionItem from "./CarouselActionItem.jsx";
import { useClimateActions } from "../../contexts/ClimateActionsContext.js";
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

  console.log(isTablet);

  const sortForMobileClimateActions = orderBy(
    climateActions,
    ["action_of_the_month"],
    ["desc"]
  );

  return (
    <>
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
        {isMobile
          ? sortForMobileClimateActions.map((action) => (
              <SwiperSlide
                key={action.id}
                className={"h-auto min-h-full mb-10"}
              >
                <CarouselActionItem
                  action={action}
                  user={user}
                  updateLocalAccepted={updateLocalAccepted}
                  categories={categories}
                ></CarouselActionItem>
              </SwiperSlide>
            ))
          : climateActions.map((action) => (
              <SwiperSlide
                key={action.id}
                className={"h-auto min-h-full mb-10"}
              >
                <CarouselActionItem
                  action={action}
                  user={user}
                  updateLocalAccepted={updateLocalAccepted}
                  categories={categories}
                ></CarouselActionItem>
              </SwiperSlide>
            ))}
        <div className="flex flex-row justify-between absolute z-10 top-1/2 w-full">
          <div
            ref={navigationPrevRef}
            className={
              "button border-none shadow-none focus:outline-none fas fa-arrow-left hidden t:block"
            }
          />
          <div
            ref={navigationNextRef}
            className={
              "button border-none shadow-none focus:outline-none fas fa-arrow-right hidden t:block"
            }
          />
        </div>
      </Swiper>
    </>
  );
};

export default CarouselList;
