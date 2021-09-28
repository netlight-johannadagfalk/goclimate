import React, { useEffect, useState } from "react";
import CarouselActionItem from "./CarouselActionItem.jsx";
import { useClimateActions } from "../../../contexts/ClimateActionsContext.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import { orderBy } from "lodash";
import { useMediaQuery } from "react-responsive";
import { m, d, dLg } from "../../../constants";

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
  const isLargeTablet = useMediaQuery({ query: `(max-width: ${d})` });
  const isDesktop = useMediaQuery({ query: `(max-width: ${dLg})` });

  const sortForMobileClimateActions = orderBy(
    climateActions,
    ["action_of_the_month"],
    ["desc"]
  );

  const actions =
    isMobile || isLargeTablet ? sortForMobileClimateActions : climateActions;

  const noOfItemsShown = isMobile
    ? 1.5
    : isLargeTablet
    ? 2.5
    : isDesktop
    ? 3
    : 4;

  //const loopActions = actions.length > noOfItemsShown ? true : false;

  const [loopActions, setLoopActions] = useState(
    actions.length > noOfItemsShown ? true : false
  );
  const hideArrows = isMobile || !loopActions ? true : false;

  // const [hideArrows, setHideArrows] = useState(false);

  useEffect(() => {
    actions.length > noOfItemsShown
      ? setLoopActions(true)
      : setLoopActions(false);
  }, [climateActions]);

  // useEffect(() => {
  //   isMobile || !loopActions ? setHideArrows(true) : setHideArrows(false);
  // }, [loopActions]);

  // console.log({ hideArrows });

  //const hideArrows = isMobile ? true : false;

  // const [loopActions, setLoopActions] = useState();
  // const [hideArrows, setHideArrows] = useState();
  // useEffect(() => {
  //   actions.length > noOfItemsShown
  //     ? setLoopActions(true)
  //     : setLoopActions(false),
  //     [actions.length];
  // });

  // useEffect(() => {
  //   isMobile || !loopActions ? setHideArrows(true) : setHideArrows(false),
  //     [loopActions];
  // });

  //console.log({ hideArrows });
  //console.log({ navigationNextRef });
  console.log({ navigationPrevRef });
  return (
    <div className="relative overflow-visible">
      <Swiper
        className="m-4"
        loop={loopActions}
        slidesPerView={noOfItemsShown}
        //slidesPerGroup={noOfItemsShown}
        //onSwiper={console.log}
        navigation={
          //hideArrows
          //?
          {
            // nextEl: ".testing",
            // prevEl: ".testing1",
            nextEl: ".testing1",
            prevEl: ".testing",
          }
          //: false
        }
        //pagination={true}
        preventClicks={false}
        preventClicksPropagation={false}
        noSwiping={true}
        noSwipingSelector={"button"}
        observer={true}
        observeParents={true}
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
      <div
        className={`flex flex-row absolute z-10 top-1/2 w-full ${
          hideArrows ? "invisible" : ""
        }
        `}
      >
        <div className="relative w-full">
          <button
            ref={navigationPrevRef}
            onClick={() => console.log(navigationPrevRef)}
            className={`rounded-full -left-6 h-12 w-12 bg-white border border-gray-accent fas fa-chevron-left absolute focus:outline-none testing`}
          />
          <button
            ref={navigationNextRef}
            className={
              "rounded-full -right-6 h-12 w-12 bg-white border border-gray-accent fas fa-chevron-right absolute focus:outline-none testing1"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CarouselList;
