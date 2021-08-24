import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import CarouselActionItem from "./CarouselActionItem.jsx";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
//import "swiper/components/navigation/navigation.scss";

// Swiper resources
//https://swiperjs.com/react
//https://swiperjs.com/swiper-api#parameters

import SwiperCore, { Navigation, Pagination, Scrollbar } from "swiper/core";
SwiperCore.use([Pagination, Navigation, Scrollbar]);

const CarouselList = ({
  user,
  climateActionsUser,
  updateLocalAccepted,
  addAcceptedAction,
}) => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);
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
        onSlideChange={() => console.log("slide change")}
      >
        {climateActionsUser.map((action) => (
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

// const CarouselList = ({
//   user,
//   climateActionsUser,
//   updateLocalAccepted,
//   addAcceptedAction,
// }) => {
//   return (
//     <Carousel
//       centerMode={true}
//       centerSlidePercentage={25}
//       showThumbs={false}
//       showStatus={false}
//       infiniteLoop={false}
//       showIndicators={false}
//       autoPlay={false}
//       showArrows={false}
//       renderArrowPrev={
//         (onClickHandler, hasPrev) => (
//           //hasPrev && (
//           <button
//             type="button"
//             className="button absolute border-none shadow-none bottom-0 focus:outline-none fas fa-arrow-circle-left"
//             onClick={onClickHandler}
//           ></button>
//         )
//         //)
//       }
//       renderArrowNext={
//         (onClickHandler, hasNext) => (
//           //hasNext && (
//           <button
//             type="button"
//             className="button border-none shadow-none float-right focus:outline-none fas fa-arrow-circle-right"
//             onClick={onClickHandler}
//           ></button>
//         )
//         //)
//       }
//     >
//       {climateActionsUser.map((action) => (
//         <CarouselActionItem
//           action={action}
//           key={action.id}
//           user={user}
//           updateLocalAccepted={updateLocalAccepted}
//           addAcceptedAction={addAcceptedAction}
//         ></CarouselActionItem>
//       ))}
//     </Carousel>
//   );
// };

export default CarouselList;
